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

		var (
			db = resource.DB
		)

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		event := model.Event{ Name:u.Name, Capacity:u.Capacity, Place:u.Place }
		db.Create(&event)

		log.Println(event)

		responseApi := map[string]int{"ID": event.ID}

		api := APIFormat{"success", 1, 0, responseApi}
		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) UpdateEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			event = model.Event{}
		)

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		reqEvent := model.Event{ ID:u.ID, Name:u.Name, Capacity:u.Capacity, Place:u.Place }

		log.Println(reqEvent)
//		responseApi := map[string]int{"ID": event.ID}

		db.Model(event).Where(c.Param("id")).Find(&event)
		api := APIFormat{"success", 1, 0, event}

		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) DeleteEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

//		responseApi := map[string]int{"ID": event.ID}

		api := APIFormat{"success", 1, 0, "hoge"}
		return c.JSON(http.StatusOK, &api)
	}
}