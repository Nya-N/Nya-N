package model
import (
	"time"
)

type Member struct {
	ID int `sql:"AUTO_INCREMENT" gorm:"primary_key" json:"id"`
	EventID int `json:"event_id"`
	Name string `sql:"size:255" json:"name"`
	Status int `json:"status"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}
