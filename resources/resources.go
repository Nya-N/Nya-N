package resources

import (
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
	"io/ioutil"
	"gopkg.in/yaml.v2"
	"os"
)

const date_format string = "2006/01/02"

type Resource struct {
	DB *gorm.DB
}

type APIFormat struct {
	Status    string      `json:"status"`
	Version   int         `json:"version"`
	ErrorCode int         `json:"error_code"`
	Response  interface{} `json:"response"`
}

type AccountAPI struct {
	ID    int	`json:"id"`
	Name  string 	`json:"name"`
	Image string 	`json:"img_path"`
}

type EventListAPI struct {
	PrevId int           `json:"prev_id"`
	NextId int           `json:"next_id"`
	Events []EventResponse `json:"events"`
}

type EventResponse struct {
	ID          int             `json:"id"`
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

func (resource *Resource) getEventResponse(event model.Event) EventResponse {
	return EventResponse{
		ID:          event.ID,
		Name:        event.Name,
		Image:       event.Image,
		Capacity:    event.Capacity,
		Admin:       event.Admin,
		Members:     event.Members,
		StartDate:   event.StartDate.Format(date_format),
		Place:       event.Place,
		Description: event.Description,
		Comments:    event.Comments,
	}
}

func (resource *Resource) getEventsResponse(events []model.Event) []EventResponse {
	var events_res = []EventResponse{}
	for _,v := range events {
		events_res = append(events_res, resource.getEventResponse(v))
	}
	return events_res
}


func (resource *Resource)SetDBConnection() *gorm.DB {
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