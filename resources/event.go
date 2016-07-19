package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"strconv"
	"time"
)

func (resource *Resource) GetEvents() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			events = []model.Event{}
			viewCount = 10
			current int
			prev_id int
			next_id int
		)
		log.Println("p is ....")
		log.Println(c.QueryParam("p"))
		if (c.QueryParam("p") != "") {
			current, _ = strconv.Atoi(c.QueryParam("p"))
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
		log.Println("Strart GetEvent")
		var (
			db = resource.DB
			event = model.Event{}
			event_res = EventResponse{}
			admin = model.Member{}
			members = []model.Member{}
			comments = []model.Comment{}
		)

		db.Where("id = ?",c.Param("id")).Find(&event)
		db.Model(&event).Related(&admin).Related(&members).Related(&comments)

		event.Admin = admin
		event.Members = members
		event.Comments = comments

		event_res = resource.getEventResponse(event)

		log.Println(event_res)

		api := APIFormat{"success", 1, 0, event_res}
		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) CreateEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		log.Println("Strart CreateEvent")

		var (
			db = resource.DB
		)

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		t, _ := time.Parse("2006/01/02", u.StartDate)

		event := model.Event{
			Name:u.Name,
			Image:u.Image,
			StartDate:t,
			Capacity:u.Capacity,
			Admin: model.Member{Name:u.Admin, AdminStatus:1},
			Place: u.Place,
			Description: u.Description,
			Comments:[]model.Comment{},
		}
		db.Create(&event)

		responseApi := map[string]int{"id": event.ID}

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

		db.Model(event).Where(c.Param("id")).Find(&event)

		t, _ := time.Parse("2006/01/02", u.StartDate)

		event.Name      = u.Name
		event.StartDate = t
		event.Capacity  = u.Capacity
		event.Place     = u.Place
		event.Image     = u.Image
		event.Description = u.Description

		db.Model(event).Update(&event)

		api := APIFormat{"success", 1, 0, event}

		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) DeleteEvent() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db = resource.DB
			event = model.Event{}
		)
		responseApi := map[string]string{"ID": c.Param("id")}

		db.Model(event).Where(c.Param("id")).Delete(&event)


		api := APIFormat{"success", 1, 0, responseApi}
		return c.JSON(http.StatusOK, &api)
	}
}