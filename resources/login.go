package resources
import (
	"github.com/labstack/echo"
	"log"
	"fmt"
	"io/ioutil"
	"golang.org/x/oauth2/google"
	"net/http"
	"golang.org/x/oauth2"
	"github.com/syo-sa1982/GoNTAkun/model"
	"encoding/json"
)

func (resource *Resource) GetLogin() echo.HandlerFunc {

	return func(c echo.Context) error {

		// TODO:クッキーをみてIDを取得して、DBからIDをキーにトークンを取得する、トークンがない、もしくは有効期限切れてるならGoogle認証
		// 有効期限切れはもう少し簡単な方法があったきがする・・・

		// Google認証処理を開始
		fmt.Println("Google認証処理を開始")
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
		fmt.Println("URL取得。URL= ", authURL)
		// 認証ページにリダイレクト
		return c.Redirect(http.StatusMovedPermanently,authURL)
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
		fmt.Printf("contents= %#v\n", auth)

		return nil

	}
}
