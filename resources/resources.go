package resources

import (
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
)

type Resource struct {
	DB *gorm.DB
}

type APIFormat struct {
	Status    string      `json:"status"`
	Version   int         `json:"version"`
	ErrorCode int         `json:"error_code"`
	Response  interface{} `json:"response"`
}

type EventListAPI struct {
	PrevId int           `json:"prev_id"`
	NextId int           `json:"next_id"`
	Events []model.Event `json:"events"`
}

type EventResponse struct {
	Name        string          `json:"name"`
	Image       string          `json:"image"`
	Capacity    int             `json:"capacity"`
	Admin       model.Member    `json:"admin"`
	Members     []model.Member  `json:"members"` // One-To-Many relationship (has many)
	StartDate   string          `json:"start_date"`
	Place       string          `json:"place"`
	Description string          `json:"description"`
	Comments    []model.Comment `json:"comments"` // One-To-Many relationship (has many)
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

func (*Resource) getEventResponse(event model.Event) EventResponse {

	event_res := EventResponse{
		Name : event.Name,
		Image : event.Image,
		Capacity : event.Capacity,
		Admin : event.Admin,
		Members : event.Members,
		StartDate : event.StartDate.Format("2006/01/02 15:04:05"),
		Place : event.Place,
		Description : event.Description,
		Comments : event.Comments,
	}

	return event_res
}
