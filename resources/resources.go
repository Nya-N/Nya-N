package resources
import (
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
	"time"
)


type Resource struct {
	DB *gorm.DB
}

type APIFormat struct {
	Status string `json:"status"`
	Version int `json:"version"`
	ErrorCode int `json:"error_code"`
	Response interface{} `json:"response"`
}

type EventListAPI struct {
	PrevId int `json:"prev_id"`
	NextId int `json:"next_id"`
	Events []model.Event `json:"events"`
}

type EventAPI struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Image string `json:"image"`
	Capacity int `json:"capacity"`
	Admin model.Member `json:"admin"`
	Members []model.Member `json:"members"` // One-To-Many relationship (has many)
	StartDate time.Time `json:"start_date"`
	Place string `json:"place"`
	Description string `json:"description"`
	Comments []model.Comment `json:"comments"` // One-To-Many relationship (has many)
}

type EventRequest struct {
	Name        string `json:"name"`
	Admin       string `json:"admin"`
	StartDate   string `json:"start_date"`
	Capacity    int    `json:"capacity"`
	Place       string `json:"place"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type JoinRequest struct {
	EventId int    `json:"event_id"`
	Name    string `json:"name"`
}

type CommentRequest struct {
	EventID int    `json:"event_id"`
	Name    string `json:"name"`
	Body    string `json:"body"`
}
