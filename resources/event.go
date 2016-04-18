package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
)



func (resource *Resource) GetEvents() echo.HandlerFunc {

	return func(c echo.Context) error {
		var (
			db = resource.DB
			events = []model.Event{}
		)
		prev_id := c.QueryParam("prev_id")
		next_id := c.QueryParam("next_id")

		db.Model(events).Find(&events)

		log.Println(events)
		log.Println(prev_id)
		log.Println(next_id)

		return c.String(http.StatusOK, "GetEvents!\n")
	}
}

func (resource *Resource) GetEvent(c echo.Context) error {
	id := c.Param("id")
	return c.String(http.StatusOK, id)
}
