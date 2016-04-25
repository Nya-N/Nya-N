package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"strconv"
	"encoding/json"
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


type EventReqest struct {
	Name        string `json:"name"`
	Admin       string `json:"admin"`
	StartDate   string `json:"start_date"`
	Capacity    int    `json:"capacity"`
	Place       string `json:"name"`
	Description string `json:"name"`

}

func (resource *Resource) CreateEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		body := c.Request().Body()
		// ここからどうやってjsonにすればいい？
		log.Println(body)
		log.Println(&body)

		// 動かん
		// dec := json.NewDecoder(&body)
		// log.Println(dec)

//		var (
//			db = resource.DB
//			event = model.Event{}
//		)
		response := model.Event{ID:1}
		api := APIFormat{"success", 1, 0, response}
		return c.JSON(http.StatusOK, &api)
	}
}