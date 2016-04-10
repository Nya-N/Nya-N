package resources
import (
	"github.com/labstack/echo"
	"net/http"
)


func (resource *Resource) GetEvents() echo.HandlerFunc  {
	return func(c echo.Context) error {
		return c.String(http.StatusOK, "GetEvents!\n")
	}
}

func (resource *Resource) GetEvent(c echo.Context) echo.HandlerFunc  {
	id := c.Param("id")
	return func(c echo.Context) error {
		return c.String(http.StatusOK, id)
	}
}
