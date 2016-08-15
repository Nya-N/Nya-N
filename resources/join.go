package resources
import (
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"github.com/labstack/echo"
	"log"
	"github.com/syo-sa1982/GoNTAkun/services"
)





func (resource *Resource) JoinEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			googleAccount = model.GoogleAccount{}
			account = model.Account{}
			join_res = JoinResponce{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		// クッキーからIDを取得する
		strId := ""
		id , _:= c.Cookie("id")
		if id != nil && id.Value() != "" {
			// IDを複合する
			strId = services.DecrypterBase64(id.Value())
		}

		if strId == "" {
			// TODO: エラー処理
			//return
		} else {
			// アカウントテーブルを取得
			db.Model(account).Where("id = ?", strId, ).Find(&account)

			// googleアカウントテーブルを取得
			db.Model(googleAccount).Where("g_id = ?", account.GID, ).Find(&googleAccount)
		}

		u := new(JoinRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		member := model.Member{
			EventID:u.EventId,
			AccountId: account.ID,
			Name:googleAccount.Name,
			Picture: googleAccount.Picture,
		}
		log.Println(member)

		db.Create(&member)

		join_res.ID = member.ID
		join_res.AccountID = account.ID
		join_res.Name = googleAccount.Name
		join_res.Image = googleAccount.Picture

		//responseApi := map[string]int{"id": member.ID}

		api := APIFormat{"success", 1, 0, join_res}
		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) CancelEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			member = model.Member{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		responseApi := map[string]string{"id": c.Param("join_id")}

		db.Model(member).Where("id = ?",c.Param("join_id")).Delete(&member)
		log.Println(responseApi)

		api := APIFormat{"success", 1, 0, responseApi}
		return c.JSON(http.StatusOK, &api)
	}
}