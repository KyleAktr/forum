package models

import "time"

type User struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	Username       string     `json:"username" gorm:"unique;not null"`
	Email          string     `json:"email" gorm:"unique;not null"`
	Password       string     `json:"-" gorm:"not null"`
	City           string     `json:"city"`
	Age            int        `json:"age"`
	Bio            string     `json:"bio"`
	ProfilePicture string     `json:"profilePicture"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	Posts          []Post     `json:"posts" gorm:"foreignKey:UserID"`
	Comments       []Comment  `json:"comments" gorm:"foreignKey:UserID"`
	Reactions      []Reaction `json:"reactions" gorm:"foreignKey:UserID"`
	GoogleID       *string    `json:"google_id" gorm:"unique"`
}

type CreateUserInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type UpdateProfileInput struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	City     string `json:"city"`
	Age      int    `json:"age"`
	Bio      string `json:"bio"`
}

type GoogleUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}
