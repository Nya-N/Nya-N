package resources
import (
	"github.com/jinzhu/gorm"
	"github.com/syo-sa1982/GoNTAkun/model"
)


type Resource struct {
	DB *gorm.DB
}

type APIFormat struct {
	Status string ``
	Version int
	ErrorCode int
	Response interface{}
}

type EventListAPI struct {
	PrevId int
	NextId int
	Events []model.Event
}
