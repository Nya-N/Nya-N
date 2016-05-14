package resources
import (
	"github.com/labstack/echo"
	"net/http"
)



func (resource *Resource) CreateComment() echo.HandlerFunc {
	return func(c echo.Context) error {
//		var (
//			db = resource.DB
//		)

		u := new(CommentRequest)
		if err := c.Bind(u); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, u)

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
