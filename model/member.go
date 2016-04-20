package model
import (
	"time"
)

type Member struct {
	ID int `json:"id"`
	Name string `sql:"size:255" json:"name"`
	Status int `json:"status"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}
