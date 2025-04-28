package controllers

import (
	"forum/database"
	"forum/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func GetPosts(c *gin.Context) {
	var posts []models.Post
	query := database.DB.Preload("User").Preload("Category").Preload("Comments").Preload("Reactions")

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "100"))
	offset := (page - 1) * limit

	// Filtrage par catégorie
	if categoryID := c.Query("category_id"); categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	// Recherche par titre ou contenu
	if search := c.Query("search"); search != "" {
		query = query.Where("title LIKE ? OR content LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Exécution de la requête avec pagination
	if err := query.Offset(offset).Limit(limit).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des posts"})
		return
	}

	// Récupération du nombre total de posts pour la pagination
	var total int64
	query.Count(&total)

	c.JSON(http.StatusOK, gin.H{
		"data": posts,
		"meta": gin.H{
			"total":     total,
			"page":      page,
			"limit":     limit,
			"last_page": (int(total) + limit - 1) / limit,
		},
	})
}

// -----------CreatePost-----------

func CreatePost(c *gin.Context) {
	var input models.Post

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	// Validation des champs obligatoires
	if input.Title == "" || input.Content == "" || input.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tous les champs sont obligatoires"})
		return
	}

	// Récupération de l'utilisateur authentifié
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	post := models.Post{
		Title:      input.Title,
		Content:    input.Content,
		CategoryID: input.CategoryID,
		UserID:     userID.(uint),
	}

	// Vérification de l'existence de la catégorie
	var category models.Category
	if err := database.DB.First(&category, input.CategoryID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Catégorie non trouvée"})
		return
	}

	// Création du post avec les relations
	if err := database.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création du post"})
		return
	}

	// Chargement des relations pour la réponse
	database.DB.Preload("User").Preload("Category").First(&post, post.ID)

	c.JSON(http.StatusCreated, gin.H{"data": post})
}

// -----------GetUserPosts-----------

func GetUserPosts(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	var posts []models.Post
	query := database.DB.
		Where("user_id = ?", userID).
		Preload("User").
		Preload("Category").
		Preload("Comments").
		Preload("Reactions")

	// Pagination (optionnelle)
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	if err := query.Offset(offset).Limit(limit).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des posts"})
		return
	}

	var total int64
	query.Count(&total)

	c.JSON(http.StatusOK, gin.H{
		"data": posts,
		"meta": gin.H{
			"total":     total,
			"page":      page,
			"limit":     limit,
			"last_page": (int(total) + limit - 1) / limit,
		},
	})
}

// -----------GetPostByID-----------

func GetPostByID(c *gin.Context) {
	id := c.Param("id")
	var post models.Post

	if err := database.DB.Preload("User").Preload("Category").Preload("Comments").Preload("Reactions").First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post non trouvé"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// -----------UpdatePost-----------

func UpdatePost(c *gin.Context) {
	db := database.DB

	postID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de post invalide"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	var post models.Post
	if err := db.Where("id = ? AND user_id = ?", postID, userID).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post non trouvé ou vous n'êtes pas autorisé à le modifier"})
		return
	}

	var input models.Post
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Données invalides"})
		return
	}

	if input.Title == "" || input.Content == "" || input.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tous les champs sont obligatoires"})
		return
	}

	post.Title = input.Title
	post.Content = input.Content
	post.CategoryID = input.CategoryID
	post.UpdatedAt = time.Now()

	if err := db.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour du post"})
		return
	}

	db.Preload("User").Preload("Category").Preload("Comments").Preload("Reactions").First(&post, post.ID)

	c.JSON(http.StatusOK, gin.H{"data": post})
}
