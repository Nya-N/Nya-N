package main

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/echo/engine/standard"
	"fmt"
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/resources"
)

var (
	db   gorm.DB
	resource resources.Resource
)

func hello() echo.HandlerFunc  {
	return func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!\n")
	}
}

func rooter(e *echo.Echo) (*echo.Echo){
	fmt.Println(e)
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	// Routes
	e.Get("/", hello())
	e.Get("/event", resource.GetEvents)
	e.Get("/event/:id", resource.GetEvent)

	return e
}

func main() {
	fmt.Println("main")
	e := rooter(echo.New())
	fmt.Println("Server running at http://localhost:4000")
	// Start server
	e.Run(standard.New(":4000"))
}