package controllers

import (
	"fmt"
	"forum/database"
	"forum/models"
	"forum/utils"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig *oauth2.Config

func InitGoogleOAuth() {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	googleOauthConfig = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  "http://localhost:8080/api/auth/google/callback",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

func Register(c *gin.Context) {
	var input models.CreateUserInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Vérifier si le nom d'utilisateur existe déjà
	var existingUser models.User
	if err := database.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ce nom d'utilisateur est déjà utilisé"})
		return
	}

	// Vérifier si l'email existe déjà
	if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cet email est déjà utilisé"})
		return
	}

	if !isStrongPassword(input.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"})
		return
	}

	// Hash du mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du hashage du mot de passe"})
		return
	}

	defaultPictures := []string{
		"/assets/default_profiles/pp-default-1.jpg",
		"/assets/default_profiles/pp-default-2.jpg",
		"/assets/default_profiles/pp-default-3.jpg",
		"/assets/default_profiles/pp-default-4.jpg",
	}
	rand.Seed(time.Now().UnixNano())
	randomPic := defaultPictures[rand.Intn(len(defaultPictures))]

	user := models.User{
		Username:       input.Username,
		Email:          input.Email,
		Password:       string(hashedPassword),
		ProfilePicture: randomPic,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création de l'utilisateur"})
		return
	}

	// Générer le token JWT
	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la génération du token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user": gin.H{
			"id":             user.ID,
			"username":       user.Username,
			"email":          user.Email,
			"city":           user.City,
			"age":            user.Age,
			"bio":            user.Bio,
			"profilePicture": user.ProfilePicture,
		},
	})
}

func Login(c *gin.Context) {
	var input models.LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ? OR username = ?", input.Identifier, input.Identifier).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Identifiants ou mot de passe incorrect"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email ou mot de passe incorrect"})
		return
	}

	// Générer le token JWT
	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la génération du token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":             user.ID,
			"username":       user.Username,
			"email":          user.Email,
			"city":           user.City,
			"age":            user.Age,
			"bio":            user.Bio,
			"profilePicture": user.ProfilePicture,
		},
	})
}

func UpdateProfile(c *gin.Context) {
	var input models.UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Récupérer l'ID de l'utilisateur
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}

	// Vérifier si l'email est déjà utilisé
	if input.Email != "" && input.Email != user.Email {
		var existingUser models.User
		if err := database.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cet email est déjà utilisé"})
			return
		}
	}

	// Vérifier si le username est déjà utilisé
	if input.Username != "" && input.Username != user.Username {
		var existingUser models.User
		if err := database.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ce nom d'utilisateur est déjà utilisé"})
			return
		}
	}

	if input.Password != "" {
		if !isStrongPassword(input.Password) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"})
			return
		}
	}

	// Mettre à jour les champs si fournis
	if input.Username != "" {
		user.Username = input.Username
	}
	if input.Email != "" {
		user.Email = input.Email
	}
	if input.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du hashage du mot de passe"})
			return
		}
		user.Password = string(hashedPassword)
	}

	user.City = input.City
	user.Age = input.Age
	user.Bio = input.Bio

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour du profil"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             user.ID,
		"username":       user.Username,
		"email":          user.Email,
		"city":           user.City,
		"age":            user.Age,
		"bio":            user.Bio,
		"profilePicture": user.ProfilePicture,
	})
}

func UploadProfilePicture(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Aucun fichier fourni"})
		return
	}

	if !strings.HasPrefix(file.Header.Get("Content-Type"), "image/") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Le fichier doit être une image"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	// Vérifier s'il a déjà une photo de profil
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}

	// Supprimer ancienne photo de profil
	if user.ProfilePicture != "" {
		oldFilePath := filepath.Join(".", user.ProfilePicture)
		if err := os.Remove(oldFilePath); err != nil {
			fmt.Printf("Erreur lors de la suppression de l'ancienne photo: %v\n", err)
		}
	}

	// Générer un nom de fichier unique
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("profile_%v_%d%s", userID, time.Now().Unix(), ext)

	if err := c.SaveUploadedFile(file, "uploads/profiles/"+filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la sauvegarde de l'image"})
		return
	}

	user.ProfilePicture = "/uploads/profiles/" + filename
	if err := database.DB.Save(&user).Error; err != nil {
		// Si la mise à jour de la base de données échoue, on supprime le fichier qu'on vient d'uploader
		if err := os.Remove("uploads/profiles/" + filename); err != nil {
			fmt.Printf("Erreur lors de la suppression du fichier uploadé: %v\n", err)
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la mise à jour du profil"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"profilePicture": user.ProfilePicture,
	})
}

func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Utilisateur non trouvé"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

func DeleteAccount(c *gin.Context) {
	db := database.DB
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Utilisateur non authentifié"})
		return
	}

	if err := db.Where("user_id = ?", userID).Delete(&models.Reaction{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression des réactions"})
		return
	}

	if err := db.Where("user_id = ?", userID).Delete(&models.Comment{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression des commentaires"})
		return
	}

	if err := db.Where("user_id = ?", userID).Delete(&models.Post{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression des posts"})
		return
	}

	if err := db.Where("id = ?", userID).Delete(&models.User{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la suppression du compte"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Compte supprimé avec succès"})
}

func GetUsers(c *gin.Context) {
	var users []models.User

	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des utilisateurs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": users})
}

func isStrongPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasDigit := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[@$!%*?&]`).MatchString(password)

	return hasLower && hasUpper && hasDigit && hasSpecial
}
