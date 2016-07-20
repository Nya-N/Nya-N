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
	"reflect"
)

func (resource *Resource) GetLogin() echo.HandlerFunc {

	return func(c echo.Context) error {

		// ここから　google認証*******
		fmt.Println("Google認証処理を開始します")
		// JSONから設定ファイル読み込み
		confFile, err := ioutil.ReadFile("resources/client_secret.json")
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		fmt.Println("JSON読み込み成功")
		config, err := google.ConfigFromJSON(confFile)
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		config.Scopes = []string{
			"https://www.googleapis.com/auth/userinfo.profile",
		}
		fmt.Println("JSONからconfigの生成成功")
		authURL := config.AuthCodeURL("state")
		fmt.Println("URL取得。URL= ", authURL)
		fmt.Println("リダイレクトする。リダイレクトの仕方がわからん！！！")
		return c.Redirect(http.StatusMovedPermanently,authURL)
		//return c.Redirect(305,authURL)
		// ここまで  google認証*******


	}
}

func (resource *Resource) GetOauth() echo.HandlerFunc {

	return func(c echo.Context) error {


		// JSONから設定ファイル読み込み
		confFile, err := ioutil.ReadFile("resources/client_secret.json")
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		fmt.Println("JSON読み込み成功")
		config, err := google.ConfigFromJSON(confFile)
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		token, err := config.Exchange(oauth2.NoContext, c.QueryParam("code"))
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		fmt.Println("token= ", token)

		client := config.Client(oauth2.NoContext, token)

		res, err := client.Get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json")
		//res, err := client.Get("https://www.googleapis.com/auth/userinfo.profile")
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}

		// JSONでプロフィールを取得
		buf := make([]byte, 1024)
		res.Body.Read(buf)
		fmt.Println("body= ", string(buf))
		var test string
		test = string(buf)
		fmt.Println("test= ", test)
		fmt.Println(reflect.TypeOf(test))
		var auth model.Auth
		json.Unmarshal([]byte(test), &auth)
		fmt.Printf("contents= %#v\n", auth)

		//response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
		//
		//defer response.Body.Close()
		//contents, err := ioutil.ReadAll(response.Body)
		//fmt.Println("contents= ", contents)

		//fmt.Println("res= ", res)
		//fmt.Println("res.Body= ", res.Body)



		return nil
		// ここまで  google認証*******


	}
}
