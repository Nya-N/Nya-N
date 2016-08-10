package model
import (
	"time"
)

type Member struct {
	ID int `sql:"AUTO_INCREMENT" gorm:"primary_key" json:"id"`
	EventID int `json:"event_id"`
	AccountId string `sql:"size:255" json:"name"` // encript
	Name string `sql:"size:255" json:"name"`
	Picture string `sql:"size:255" json:"picture"`
	AdminStatus int `json:"admin_status"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}
