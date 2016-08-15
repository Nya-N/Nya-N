package model
import (
	"time"
)

type Account struct {
	ID int `sql:"AUTO_INCREMENT" gorm:"primary_key" json:"id"`
	GID string `sql:"size:255" json:"gid"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}
