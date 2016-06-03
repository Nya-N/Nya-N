package main

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/echo/engine/standard"
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/resources"
	"io/ioutil"
	"gopkg.in/yaml.v2"
	"os"
	"log"
)


func rooter(e *echo.Echo) (*echo.Echo){
	log.Println(e)

	resource := resources.Resource{}
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	dbcon :=  SetDBConnection()

	resource.DB = dbcon

	// Routes
	e.Get("/api/event", resource.GetEvents())
	e.Post("/api/event", resource.CreateEvent())
	e.Get("/api/event/:id", resource.GetEvent())
	e.Put("/api/event/:id", resource.UpdateEvent())
	e.Delete("/api/event/:id", resource.DeleteEvent())

	e.Post("/api/comment", resource.CreateComment())
	e.Delete("/api/comment/:comment_id", resource.DeleteComment())

	e.Static("/", "public")

	return e
}

func setup_log() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
}

func main() {
	setup_log()

	log.Println("main")
	e := rooter(echo.New())
	log.Println("Server running at http://localhost:4000")
	// Start server
	e.Run(standard.New(":4000"))
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
