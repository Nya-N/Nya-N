package resources
import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/syo-sa1982/GoNTAkun/model"
	"log"
	"strconv"
	"fmt"
	"io/ioutil"
	"golang.org/x/oauth2/google"
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
			admin = model.Member{}
			members = []model.Member{}
			comments = []model.Comment{}
		)

		db.Where("id = ?",c.Param("id")).Find(&event)

		log.Println(event)
		db.Model(&event).Related(&admin).Related(&members).Related(&comments)

		event.Admin = admin
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

		// ここから　google認証*******
		fmt.Println("Google認証処理を開始します")
		// JSONから設定ファイル読み込み
		confFile, err := ioutil.ReadFile("resources/client_secret.json")
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		fmt.Println("JSON読み込み成功")
		config, err := google.ConfigFromJSON(confFile)
		if err != nil {
			log.Fatalf("Unable to read client secret file: %v", err)
		}
		config.Scopes = []string{
			"https://www.googleapis.com/auth/userinfo.profile",
		}
		fmt.Println("JSONからconfigの生成成功")
		authURL := config.AuthCodeURL("state")
		fmt.Println("URL取得。URL= ", authURL)
		fmt.Println("リダイレクトする。リダイレクトの仕方がわからん！！！")
		//return c.Redirect(http.StatusMovedPermanently,authURL)
		return c.Redirect(305,authURL)
		fmt.Println("test")
		// ここまで  google認証*******

		u := new(EventRequest)

		if err := c.Bind(u); err != nil {
			return err
		}

		log.Println(u.Image)

		event := model.Event{
			Name:u.Name,
			Image:u.Image,
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

		event.Name      = u.Name
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