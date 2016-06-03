package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
)



func (resource *Resource) CreateComment() echo.HandlerFunc {
	return func(c echo.Context) error {
		var (
			db = resource.DB
		)

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
		u := new(CommentRequest)
		if err := c.Bind(u); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, u)
	}
}
