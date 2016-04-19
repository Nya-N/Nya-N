package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"strconv"
)

func (resource *Resource) GetEvents(c echo.Context) error {

	var (
		db = resource.DB
		events = []model.Event{}
	)
	prev_id, _ := strconv.Atoi(c.QueryParam("prev_id"))
	next_id, _ := strconv.Atoi(c.QueryParam("next_id"))

	db.Model(events).Find(&events)

	log.Println(events)
	log.Println(prev_id)
	log.Println(next_id)

	api := EventListAPI{
		prev_id,
		next_id,
		events,
	}
	log.Println(api)
//
//	if err := c.Bind(api); err != nil {
//		return err
//	}

	return c.JSON(http.StatusOK, &api)
}

func (resource *Resource) GetEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		id := c.Param("id")
		return c.String(http.StatusOK, id)
	}
}
