package resources

import (
	"github.com/labstack/echo"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"net/http"
	"strconv"
	"time"
	"github.com/syo-sa1982/GoNTAkun/services"
)

func (resource *Resource) GetEvents() echo.HandlerFunc {

	return func(c echo.Context) error {

		var (
			db         = resource.DB
			events     = []model.Event{}
			events_res = []EventResponse{}
			viewCount  = 10
			current    int
			prev_id    int
			next_id    int
		)
		db = resource.SetDBConnection()
		defer db.Close()

		log.Println("p is ....")
		log.Println(c.QueryParam("p"))
		if c.QueryParam("p") != "" {
			current, _ = strconv.Atoi(c.QueryParam("p"))
		} else {
			current = 1
		}
		prev_id = current - 1
		next_id = current + 1

		db.Model(events).Offset((current - 1) * 3).Limit(viewCount).Find(&events)

		for i, s := range events {
			db.Model(&s).Related(&events[i].Members, "EventID")
		}

		events_res = resource.getEventsResponse(events)
		response := EventListAPI{prev_id, next_id, events_res}

		api := APIFormat{"success", 1, 0, response}

		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) GetEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		log.Println("Start GetEvent")
		var (
			db        = resource.DB
			event     = model.Event{}
			event_res = EventResponse{}
			admin     = model.Member{}
			members   = []model.Member{}
			comments  = []model.Comment{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		db.Where("id = ?", c.Param("id")).Find(&event)
		db.Model(&event).Related(&admin, "Admin").Related(&members, "Members").Related(&comments, "Comments")

		event.Admin = admin
		event.Members = members
		event.Comments = comments

		event_res = resource.getEventResponse(event)

		api := APIFormat{"success", 1, 0, event_res}
		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) CreateEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		log.Println("Start CreateEvent")
		var (
			db = resource.DB
			googleAccount = model.GoogleAccount{}
			account = model.Account{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		// クッキーからIDを取得する
		strId := ""
		id , _:= c.Cookie("id")
		if id != nil && id.Value() != "" {
			// IDを複合する
			strId = services.DecrypterBase64(id.Value())
		}

		if strId == "" {
			// TODO: エラー処理
			//return
		} else {
			// アカウントテーブルを取得
			db.Model(account).Where("id = ?", strId, ).Find(&account)

			// googleアカウントテーブルを取得
			db.Model(googleAccount).Where("g_id = ?", account.GID, ).Find(&googleAccount)
		}

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		t, _ := time.Parse(date_time_format, u.StartDate)

		event := model.Event{
			Name:        u.Name,
			Image:       u.Image,
			StartDate:   t,
			Capacity:    u.Capacity,
			Admin:       model.Member{AccountId: account.ID, Name: googleAccount.Name, Picture: googleAccount.Picture, AdminStatus: 1},
			Place:       u.Place,
			Description: u.Description,
			Comments:    []model.Comment{},
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
			db    = resource.DB
			event = model.Event{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		db.Model(event).Where(c.Param("id")).Find(&event)

		t, _ := time.Parse(date_format, u.StartDate)

		event.Name = u.Name
		event.StartDate = t
		event.Capacity = u.Capacity
		event.Place = u.Place
		event.Image = u.Image
		event.Description = u.Description

		db.Model(event).Update(&event)

		api := APIFormat{"success", 1, 0, event}

		return c.JSON(http.StatusOK, &api)
	}
}

func (resource *Resource) DeleteEvent() echo.HandlerFunc {

	return func(c echo.Context) error {
		var (
			db    = resource.DB
			event = model.Event{}
		)
		db = resource.SetDBConnection()
		defer db.Close()

		responseApi := map[string]string{"ID": c.Param("id")}

		db.Model(event).Where(c.Param("id")).Delete(&event)

		api := APIFormat{"success", 1, 0, responseApi}
		return c.JSON(http.StatusOK, &api)
	}
}
