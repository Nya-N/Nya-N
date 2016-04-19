package resources
import (
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
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
