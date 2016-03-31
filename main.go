package main

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/echo/engine/standard"
	"fmt"
)

func hello() echo.HandlerFunc  {
	return func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!\n")
	}
}

func main() {
	fmt.Println("main")
	// Echo instance
	e := echo.New()
	fmt.Println(e)

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.Get("/", hello())

	fmt.Println("Server running at http://localhost:4000")
	// Start server
	e.Run(standard.New(":4000"))
}