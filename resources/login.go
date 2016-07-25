package resources
import (
	"github.com/labstack/echo"
	"log"
	"fmt"
	"io/ioutil"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2"
	"github.com/syo-sa1982/GoNTAkun/model"
	"encoding/json"
	"time"
	"net/http"
	"strconv"
)

func (resource *Resource) GetLogin() echo.HandlerFunc {

	return func(c echo.Context) error {

		// TODO:有効期限切れてるならGoogle認証
		// 有効期限切れはもう少し簡単な方法があったきがする・・・

		var (
			db = resource.DB
			googleAccount = model.GoogleAccount{}
			account = model.Account{}
		)

		db = resource.SetDBConnection()
		defer db.Close()

		// クッキーからIDを取得する
		id , _:= c.Cookie("id")
		//fmt.Printf("id= %#v\n", id.Value())

		if id != nil {
			// アカウントテーブルを取得
			db.Model(account).Where("id = ?", id.Value(), ).Find(&account)
			//fmt.Printf("account= %#v\n", account)

			// googleアカウントテーブルを取得
			db.Model(googleAccount).Where("g_id = ?", account.GID, ).Find(&googleAccount)
			//fmt.Printf("googleAccount= %#v\n", googleAccount)
		}

		confFile, _ := ioutil.ReadFile("resources/client_secret.json")
		google.ConfigFromJSON(confFile)
		config, _ := google.ConfigFromJSON(confFile)

		if googleAccount.GID != "" {
			// ここにくるということは一度認証済みということ！
			fmt.Println("キャッシュから認証トークンを作成し、APIをコールできるようにする*****")

			var tokenJson interface{}
			json.Unmarshal([]byte(googleAccount.Token), &tokenJson)

			expiry, _ := time.Parse("2006-01-02 15:04:05 MST", tokenJson.(map[string]interface{})["expiry"].(string))

			// DBから取得したトークン情報から認証トークン作成
			token := &oauth2.Token{
				AccessToken: tokenJson.(map[string]interface{})["access_token"].(string),
				TokenType:   tokenJson.(map[string]interface{})["token_type"].(string),
				Expiry: expiry,
				//RefreshToken: tokenJson.(map[string]interface{})["refresh_token"].(string),
			}
			fmt.Printf("token= %#v\n", token)

			client := config.Client(oauth2.NoContext, token)
			res, _ := client.Get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json")
			// JSONからプロフィールを構造体に変換
			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				log.Fatalf("Unable to read res body: %v", err)
			}
			// testコード****
			var auth model.Auth
			json.Unmarshal(b, &auth)
			fmt.Printf("contents= %#v\n", auth)
			fmt.Println("contentsが正しくとれてればキャッシュから認証情報の取得成功です")
			// testコード****
			return c.Redirect(http.StatusFound, "/");
		} else {
			// Google認証処理を開始
			fmt.Println("Google認証処理を開始*****")
			// JSONから設定ファイル読み込み
			confFile, err := ioutil.ReadFile("resources/client_secret.json")
			if err != nil {
				log.Fatalf("Unable to read client secret file: %v", err)
			}
			// JSONからconfig生成
			config, err := google.ConfigFromJSON(confFile)
			if err != nil {
				log.Fatalf("Unable to read client secret file: %v", err)
			}
			// プロフィール情報を使いますよっとスコープ宣言 TODO:カレンダー使うなら追加する GoogleDeveloperCenterから使用APIの設定も忘れずに
			config.Scopes = []string{
				"https://www.googleapis.com/auth/userinfo.profile",
			}
			authURL := config.AuthCodeURL("state")
			fmt.Println("認証URL= ", authURL)
			// 認証ページにリダイレクト
			return c.Redirect(http.StatusFound, authURL)
		}
	}
}

func (resource *Resource) GetOauth() echo.HandlerFunc {

	return func(c echo.Context) error {

		// JSONから設定ファイル読み込み
		confFile, err := ioutil.ReadFile("resources/client_secret.json")
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		// JSONからconfig生成
		config, err := google.ConfigFromJSON(confFile)
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		// googleからもらったcodeパラメータからトークンを生成する
		token, err := config.Exchange(oauth2.NoContext, c.QueryParam("code"))
		if err != nil {
			log.Fatalf("Ecchange token by code : %v", err)
		}
		fmt.Println("token= ", token)

		client := config.Client(oauth2.NoContext, token)

		res, err := client.Get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json")
		//res, err := client.Get("https://www.googleapis.com/auth/userinfo.profile")
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}

		// JSONからプロフィールを構造体に変換
		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			log.Fatalf("Unable to read res body: %v", err)
		}
		var auth model.Auth
		json.Unmarshal(b, &auth)
		//fmt.Printf("contents= %#v\n", auth)

		// トークンをJSON形式にする
		tokenJson, _ := json.Marshal(token)

		// DBにすでにデータがあるかチェック
		var (
			db = resource.DB
			googleAccount = model.GoogleAccount{}
			account = model.Account{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		db.Model(googleAccount).Where("g_id = ?",auth.ID,).Find(&googleAccount)
		if googleAccount.GID != "" {
			// データがあれば更新
			googleAccount.Name = auth.Name
			googleAccount.Picture = auth.Picture
			googleAccount.Token = string(tokenJson)
			db.Update(&googleAccount)
		} else {
			// なければ登録
			googleAccount = model.GoogleAccount{
				GID:auth.ID,
				Name:auth.Name,
				Picture:auth.Picture,
				Token:string(tokenJson),
			}
			db.Create(&googleAccount)
		}

		// アカウント登録
		db.Model(account).Where("g_id = ?",auth.ID,).Find(&account)
		fmt.Println("contents= %#v\n", account)
		if account.GID == "" {

			// なければ登録　＆ cookieにも登録
			account.GID = auth.ID
			db.Create(&account)
			fmt.Println("account= ", account)
			fmt.Println("account.id= ", account.ID)
		}

		// クッキー登録or更新
		cookie := new(echo.Cookie)
		cookie.SetName("id")
		cookie.SetValue(strconv.Itoa(account.ID))
		//cookie.SetExpires(time.Now().Add(24 * time.Hour))
		c.SetCookie(cookie)

		return c.Redirect(http.StatusFound, "/")
	}
}
