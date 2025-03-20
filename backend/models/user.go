package models

import "time"

type User struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	Username  string     `json:"username" gorm:"unique;not null"`
	Email     string     `json:"email" gorm:"unique;not null"`
	Password  string     `json:"-" gorm:"not null"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	Posts     []Post     `json:"posts" gorm:"foreignKey:UserID"`
	Comments  []Comment  `json:"comments" gorm:"foreignKey:UserID"`
	Reactions []Reaction `json:"reactions" gorm:"foreignKey:UserID"`
}

// Structure pour la création d'un utilisateur
type CreateUserInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// Structure pour la connexion
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
