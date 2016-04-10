package models
import "time"

type Event struct {
	ID int
	Title string `sql:"size:255"`
	ImageName string `sql:"size:255"`
	MaxMember int
	Members []Member
	Place string `sql:"size:255"`
	Description string `sql:"size:255"`
	Comment string // ここだけ後で考える

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}