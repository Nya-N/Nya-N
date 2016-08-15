package model
import "time"

type Comment struct {
	ID int `json:"id"`
	EventID int `json:"event_id"`
	AccountId int `json:"account_id"`
	Name string `sql:"size:255" json:"name"`
	Picture string `sql:"size:255" json:"image"`
	Body string `sql:"size:255" json:"body"`

	
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}
