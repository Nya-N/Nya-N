package model
import "time"

type Event struct {
	ID int `sql:"AUTO_INCREMENT" gorm:"primary_key" json:"id"`
	Name string `sql:"size:255" json:"name"`
	ImagePath string `sql:"size:255" json:"image_path"`
	Capacity int `json:"capacity"`
	Admin Member `json:"admin"`
	Members []Member `json:"members"` // One-To-Many relationship (has many)
	StartDate time.Time `json:"start_date"`
	Place string `sql:"size:255" json:"place"`
	Description string `sql:"size:255" json:"description"`
	Comments []Comment `json:"comments"` // One-To-Many relationship (has many)

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

