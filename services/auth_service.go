package services

import (
	"github.com/labstack/echo"
	"log"
)
//
//type AuthService struct {
//
//
//}

func CheckCookie(c echo.Context)  {
	id, _ := c.Cookie("id")
	debug := "My ID is " + id.Value()

	log.Println(debug)
}
