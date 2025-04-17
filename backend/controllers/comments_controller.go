package controllers

import (
	"forum/database"
	"forum/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type CommentInput struct {
	Content string `json:"content" binding:"required"`
}

func AddComment(c *gin.Context) {
	db := database.DB

	// 1)Récupère l'ID du post
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de post invalide"})
		return
	}

	// 2)Vérifie que le post existe
	var post models.Post
	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post non trouvé"})
		return
	}

	// 3)Récupère l'ID de l'utilisateur depuis le token
	userID := c.MustGet("userID").(uint)

	// 4)Valide le contenu du commentaire
	var input CommentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Veuillez fournir un contenu pour le commentaire"})
		return
	}

	// 5)Crée le commentaire
	comment := models.Comment{
		PostID:    uint(postID),
		UserID:    userID,
		Content:   input.Content,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// 6)Enregistre le commentaire
	if err := db.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de l'ajout du commentaire"})
		return
	}

	// 7)Récupère le commentaire avec les relations
	var fullComment models.Comment
	db.Preload("User").First(&fullComment, comment.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Commentaire ajouté avec succès",
		"data":    fullComment,
	})
}

func GetComments(c *gin.Context) {
	db := database.DB

	// 1)Récupère l'ID du post
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de post invalide"})
		return
	}

	// 2)Vérifie que le post existe
	var post models.Post
	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post non trouvé"})
		return
	}

	// 3)Récupère les commentaires
	var comments []models.Comment
	if err := db.Where("post_id = ?", postID).Preload("User").Order("created_at desc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des commentaires"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": comments,
	})
}
