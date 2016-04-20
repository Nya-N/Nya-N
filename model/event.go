package model
import "time"

type Event struct {
	ID int `json:"id"`
	Name string `sql:"size:255" json:"name"`
	ImagePath string `sql:"size:255" json:"image_path"`
	Capacity int `json:"capacity"`
	Members []Member `json:"members"`
	StartDate time.Time `json:"start_date"`
	Place string `sql:"size:255" json:"place"`
	Description string `sql:"size:255" json:"description"`
	Comment string `sql:"size:255" json:"comment"`// ここだけ後で考える

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

