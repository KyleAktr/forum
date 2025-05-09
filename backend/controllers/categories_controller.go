package controllers

import (
	"forum/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetCategoryCounts(c *gin.Context) {
	var counts []struct {
		CategoryID uint   `json:"category_id"`
		Name       string `json:"name"`
		Count      int    `json:"count"`
	}

	// Requête pour compter les articles par catégorie
	if err := database.DB.Table("posts").
		Select("category_id, categories.name, COUNT(posts.id) as count").
		Joins("JOIN categories ON categories.id = posts.category_id").
		Group("category_id, categories.name").
		Scan(&counts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des données"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": counts})
}
