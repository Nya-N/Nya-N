package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"github.com/syo-sa1982/GoNTAkun/services"
)



func (resource *Resource) CreateComment() echo.HandlerFunc {
	return func(c echo.Context) error {
		log.Println("Start CreateComment")
		var (
			db = resource.DB
			googleAccount = model.GoogleAccount{}
			account = model.Account{}
			comment_res = CommentResponce{}
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

		u := new(CommentRequest)
		if err := c.Bind(u); err != nil {
			return err
		}

		comment := model.Comment{
			AccountId: account.ID,
			Name: googleAccount.Name,
			Picture: googleAccount.Picture,
			EventID:u.EventID,
			Body:u.Body,
		}
		db.Create(&comment)

		log.Println(comment)

		comment_res.ID = comment.ID
		comment_res.AccountID = account.ID
		comment_res.Name = googleAccount.Name
		comment_res.Image = googleAccount.Picture

		//responseApi := map[string]int{"id": comment.ID}

		api := APIFormat{"success", 1, 0, comment_res}
		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) DeleteComment() echo.HandlerFunc {
	return func(c echo.Context) error {
		log.Println("Start DeleteComment")
		var (
			db = resource.DB
			comment = model.Comment{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		responseApi := map[string]string{"ID": c.Param("comment_id")}

		db.Model(comment).Where("id = ?",c.Param("comment_id")).Delete(&comment)


		api := APIFormat{"success", 1, 0, responseApi}
		return c.JSON(http.StatusOK, &api)
	}
}
