package controllers

import (
	"forum/database"
	"forum/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSearchSuggestions(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusOK, gin.H{"suggestions": []string{}})
		return
	}

	var posts []models.Post
	database.DB.
		Where("title LIKE ?", "%"+query+"%").
		Limit(5).
		Find(&posts)

	var suggestions []string
	for _, post := range posts {
		suggestions = append(suggestions, post.Title)
	}

	c.JSON(http.StatusOK, gin.H{"suggestions": suggestions})
}
