package main

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"
	"github.com/syo-sa1982/GoNTAkun/resources"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"os"
)

func rooter(e *echo.Echo) *echo.Echo {
	fmt.Println(e)

	resource := resources.Resource{}
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	dbcon := SetDBConnection()

	resource.DB = dbcon

	// Routes
	e.Get("/api/event", resource.GetEvents())
	e.Post("/api/event", resource.CreateEvent())
	e.Get("/api/event/:id", resource.GetEvent())
	e.Put("/api/event/:id", resource.UpdateEvent())
	e.Delete("/api/event/:id", resource.DeleteEvent())

	e.Post("/api/join", resource.JoinEvent())
	e.Delete("/api/join/:join_id", resource.CancelEvent())

	e.Post("/api/comment", resource.CreateComment())
	e.Delete("/api/comment/:comment_id", resource.DeleteComment())

	e.Static("/", "public")

	return e
}

func main() {
	fmt.Println("main")
	e := rooter(echo.New())
	fmt.Println("Server running at http://localhost:60000")
	// Start server
	e.Run(standard.New(":60000"))
}

func SetDBConnection() *gorm.DB {
	yml, err := ioutil.ReadFile("conf/db.yaml")
	if err != nil {
		panic(err)
	}

	t := make(map[interface{}]interface{})

	_ = yaml.Unmarshal([]byte(yml), &t)

	conn := t[os.Getenv("GONTADB")].(map[interface{}]interface{})

	db, err := gorm.Open("mysql", conn["user"].(string)+conn["password"].(string)+"@/"+conn["db"].(string)+"?charset=utf8&parseTime=True")
	if err != nil {
		panic(err)
	}
	return db
}
