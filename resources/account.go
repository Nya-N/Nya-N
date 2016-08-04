package resources

import (
	"github.com/labstack/echo"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"net/http"
)


func (resource *Resource) GetAccount() echo.HandlerFunc {

	return func(c echo.Context) error {
		log.Println("Start GetAccount")
		var (
			db = resource.DB
			googleAccount = model.GoogleAccount{}
			account = model.Account{}
		        account_res = AccountAPI{}
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

			account_res.ID = account.ID
			account_res.Name = googleAccount.Name
			account_res.Image = googleAccount.Picture
		}

		api := APIFormat{"success", 1, 0, account_res}
		return c.JSON(http.StatusOK, &api)
	}
}


