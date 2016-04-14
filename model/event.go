package model
import "time"

type Event struct {
	ID int
	Name string `sql:"size:255"`
	ImagePath string `sql:"size:255"`
	Capacity int
	Members []Member
	StartDate time.Time
	Place string `sql:"size:255"`
	Description string `sql:"size:255"`
	Comment string `sql:"size:255"`// ここだけ後で考える

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

