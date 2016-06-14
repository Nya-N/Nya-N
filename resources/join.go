package resources
import (
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"github.com/labstack/echo"
	"log"
)





func (resource *Resource) JoinEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
		)

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		event := model.Event{
			Name:u.Name,
			Capacity:u.Capacity,
			Place: u.Place,
			Description: u.Description,
			Members: []model.Member{
				{Name:u.Admin, Status:1},
			},
			Comments:[]model.Comment{},
		}
		db.Create(&event)

		log.Println(event)

		responseApi := map[string]int{"id": event.ID}

		api := APIFormat{"success", 1, 0, responseApi}
		return c.JSON(http.StatusOK, &api)
	}
}

