package controllers

import (
	"forum/database"
	"forum/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ReactionInput struct {
	Type string `json:"type" binding:"required"`
}

func AddReaction(c *gin.Context) {
	db := database.DB

	//1)Récupère l'ID du post
	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de post invalide"})
		return
	}

	//2)Vérifie que le post existe
	var post models.Post
	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post non trouvé"})
		return
	}

	//3)Récupère l'ID de l'utilisateur depuis le token
	userID := c.MustGet("userID").(uint)

	//4)Récupère le type de réaction
	var input ReactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Veuillez spécifier le type de réaction (like)"})
		return
	}

	//5)Vérifie si l'utilisateur a déjà liké ce post
	var existingReaction models.Reaction
	result := db.Where("post_id = ? AND user_id = ?", postID, userID).First(&existingReaction)

	if result.RowsAffected > 0 {
		//6)Si un like existe déjà, le supprimer
		db.Delete(&existingReaction)
	}

	if input.Type == "like" {
		//7)Créer le nouveau like
		reaction := models.Reaction{
			PostID:    uint(postID),
			UserID:    userID,
			Like:      true,
			CreatedAt: time.Now(),
		}

		//8)Sauvegarder la réaction
		if err := db.Create(&reaction).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de l'ajout du like"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Type de réaction invalide. Seul 'like' est accepté"})
		return
	}

	//9)Récupère le post mis à jour avec toutes ses relations
	var updatedPost models.Post
	db.Preload("User").Preload("Category").Preload("Comments").Preload("Reactions").Preload("Reactions.User").First(&updatedPost, postID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Like ajouté avec succès",
		"data":    updatedPost,
	})
}

func RemoveReaction(c *gin.Context) {
	db := database.DB

	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de post invalide"})
		return
	}

	reactionID, err := strconv.Atoi(c.Param("reactionId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de réaction invalide"})
		return
	}

	userID := c.MustGet("userID").(uint)

	// Vérifier que la réaction existe et appartient à l'utilisateur
	var reaction models.Reaction
	result := db.Where("id = ? AND post_id = ? AND user_id = ?", reactionID, postID, userID).First(&reaction)

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Like non trouvé ou vous n'êtes pas autorisé à le supprimer"})
		return
	}

	if err := db.Delete(&reaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression du like"})
		return
	}

	var updatedPost models.Post
	db.Preload("User").Preload("Category").Preload("Comments").Preload("Reactions").Preload("Reactions.User").First(&updatedPost, postID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Like supprimé avec succès",
		"data":    updatedPost,
	})
}
