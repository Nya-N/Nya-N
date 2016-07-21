package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
)



func (resource *Resource) CreateComment() echo.HandlerFunc {
	return func(c echo.Context) error {
		log.Println("Start CreateComment")
		var (
			db = resource.DB
		)
		db = resource.SetDBConnection()
		defer db.Close()

		u := new(CommentRequest)
		if err := c.Bind(u); err != nil {
			return err
		}

		comment := model.Comment{
			Name:u.Name,
			EventID:u.EventID,
			Body:u.Body,
		}
		db.Create(&comment)

		log.Println(comment)

		responseApi := map[string]int{"id": comment.ID}

		api := APIFormat{"success", 1, 0, responseApi}
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
