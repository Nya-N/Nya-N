package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"strconv"
)

func (resource *Resource) GetEvents() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			events = []model.Event{}
			viewCount = 3
			current int
			prev_id int
			next_id int
		)
		if (c.QueryParam("current") != "") {
			current, _ = strconv.Atoi(c.QueryParam("current"))
		} else {
			current = 1
		}
		prev_id = current - 1
		next_id = current + 1

		db.Model(events).Offset((current - 1) * 3).Limit(viewCount).Find(&events)

		response := EventListAPI{ prev_id, next_id, events}
		api := APIFormat{"success", 1, 0, response}

		log.Println(api)

		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) GetEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			event = model.Event{}
		)

		db.Model(event).Where(c.Param("id")).Find(&event)
		api := APIFormat{"success", 1, 0, event}
		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) CreateEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		log.Println(c.QueryParams())
		log.Println(c.FormParams())
		log.Println(c.Request().URL())
		log.Println(c.Request().Header().Keys())
		log.Println(c.Request().Body())
//		var (
//			db = resource.DB
//			event = model.Event{}
//		)
		response := model.Event{ID:1}
		api := APIFormat{"success", 1, 0, response}
		return c.JSON(http.StatusOK, &api)
	}
}