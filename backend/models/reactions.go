package models

import "time"

type Reaction struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	PostID    uint      `json:"post_id" gorm:"not null"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Like      bool      `json:"like"`
	Dislike   bool      `json:"dislike"`
	CreatedAt time.Time `json:"created_at"`
	Post      Post      `json:"post" gorm:"foreignKey:PostID"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
}
