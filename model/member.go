package model
import (
	"time"
)

type Member struct {
	ID int
	Name string `sql:"size:255"`
	Status int

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}
