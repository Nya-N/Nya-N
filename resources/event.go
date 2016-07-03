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
			members = []model.Member{}
			comments = []model.Comment{}
		)

		db.Where("id = ?",c.Param("id")).Find(&event)
		db.Model(&event).Related(&members).Related(&comments)

		event.Members = members
		event.Comments = comments
		api := APIFormat{"success", 1, 0, event}
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

		member := model.Member{}

		db.Where("event_id = ?",event.ID).Find(&member)

		log.Println(member)
		log.Println(event)

		event.AdminID = member.ID

		log.Println("更新後")
		db.Model(event).Update(&event)

		log.Println(event)

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

		event.Name      = u.Name
		event.Capacity  = u.Capacity
		event.Place     = u.Place

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