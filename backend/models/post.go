package models

import "time"

type Post struct {
	ID         uint       `json:"id" gorm:"primaryKey"`
	Title      string     `json:"title" gorm:"not null"`
	Content    string     `json:"content" gorm:"not null"`
	CategoryId uint       `json:"category_id" gorm:"not null"`
	UserId     uint       `json:"user_id" gorm:"not null"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	User       User       `json:"user" gorm:"foreignKey:UserID"`
	Category   Category   `json:"category" gorm:"foreignKey:CategoryID"`
	Comments   []Comment  `json:"comments" gorm:"foreignKey:PostID"`
	Reactions  []Reaction `json:"reactions" gorm:"foreignKey:PostID"`
}
