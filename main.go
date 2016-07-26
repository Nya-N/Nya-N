package main

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"
	"github.com/syo-sa1982/GoNTAkun/resources"
	//"github.com/syo-sa1982/GoNTAkun/controllers"
	"html/template"
	"io"
	"net/http"
	"log"
)

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context ) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
func Hello(c echo.Context) error {
	log.Println("show Index")
	id, _ := c.Cookie("id")

	data := struct {ID string}{ ID: id.Value() }

	return c.Render(http.StatusOK, "hello", data)
}
func Index(c echo.Context) error {
	log.Println("show Index")
	id, _ := c.Cookie("id")

	data := struct {ID string}{ ID: id.Value() }

	return c.Render(http.StatusOK, "index", data)
}
func rooter(e *echo.Echo) *echo.Echo {
	fmt.Println(e)

	resource := resources.Resource{}
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	t := &Template{
		templates: template.Must(template.ParseGlob("public/*.html")),
	}
	e.SetRenderer(t)

	// Routes
	e.Get("/hello", Hello)
	e.Get("/", Index)

	// Routes(api)
	e.Get("/api/event", resource.GetEvents())
	e.Post("/api/event", resource.CreateEvent())
	e.Get("/api/event/:id", resource.GetEvent())
	e.Put("/api/event/:id", resource.UpdateEvent())
	e.Delete("/api/event/:id", resource.DeleteEvent())

	e.Post("/api/join", resource.JoinEvent())
	e.Delete("/api/join/:join_id", resource.CancelEvent())

	e.Post("/api/comment", resource.CreateComment())
	e.Delete("/api/comment/:comment_id", resource.DeleteComment())

	e.Get("/login", resource.GetLogin())
	e.Get("/google-oauth", resource.GetOauth())

	//e.Static("/", "public")

	fmt.Println(e)
	return e
}

func main() {
	fmt.Println("main")
	e := rooter(echo.New())
	fmt.Println("Server running at http://localhost:60000")
	// Start server
	e.Run(standard.New(":60000"))
}

