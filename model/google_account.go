package model

type GoogleAccount struct {
	GID string `sql:"size:255" gorm:"primary_key" json:"gid"`
	Name string `sql:"size:255" json:"name"`
	Picture string `sql:"size:255" json:"picture"`
	Token string `sql:"size:255" json:"token"`
}
