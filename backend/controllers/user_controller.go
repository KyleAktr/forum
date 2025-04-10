package controllers

import (
	"encoding/json"
	"fmt"
	"forum/database"
	"forum/models"
	"forum/utils"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
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

	// Hash du mot de passe
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors du hashage du mot de passe"})
		return
	}

	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "L'email ou le nom d'utilisateur existe déjà"})
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
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email ou mot de passe incorrect"})
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

func GoogleLogin(c *gin.Context) {
	if googleOauthConfig == nil {
		InitGoogleOAuth()
		if googleOauthConfig == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Configuration OAuth non disponible"})
			return
		}
	}

	// Genérer l'URL de redirection + rediriger l'utilisateur pour l'authentification
	state := "random-state-string"
	url := googleOauthConfig.AuthCodeURL(state)
	fmt.Printf("URL de redirection Google: %s\n", url)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {
	// 1. Google nous renvoie un code d'autorisation
	code := c.Query("code")
	// 2. On échange ce code contre un token
	token, err := googleOauthConfig.Exchange(c, code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Échec de l'authentification Google"})
		return
	}
	// 3. Avec ce token, on récupère les infos de l'utilisateur
	client := googleOauthConfig.Client(c, token)
	userInfo, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Impossible de récupérer les informations utilisateur"})
		return
	}
	defer userInfo.Body.Close()
	// 4. On décode les infos reçues
	var googleUser models.GoogleUser
	if err := json.NewDecoder(userInfo.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erreur de décodage des données"})
		return
	}
	// 5. On crée ou récupère l'utilisateur dans notre base
	var user models.User
	if err := database.DB.Where("google_id = ?", googleUser.ID).First(&user).Error; err != nil {
		user = models.User{
			GoogleID:       googleUser.ID,
			Username:       googleUser.Name,
			Email:          googleUser.Email,
			ProfilePicture: googleUser.Picture,
		}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur création utilisateur"})
			return
		}
	}
	// 6. On génère un token JWT pour notre application
	jwtToken, _ := utils.GenerateToken(user.ID, user.Username)
	// 7. On prépare les données à envoyer
	data := gin.H{
		"token": jwtToken,
		"user": gin.H{
			"id":             user.ID,
			"username":       user.Username,
			"email":          user.Email,
			"profilePicture": user.ProfilePicture,
			"google_id":      user.GoogleID,
		},
	}

	jsonData, _ := json.Marshal(data)
	encodedData := url.QueryEscape(string(jsonData))

	// 8. On redirige avec les données
	c.Redirect(http.StatusTemporaryRedirect,
		fmt.Sprintf("%s/login/callback?data=%s", os.Getenv("FRONTEND_URL"), encodedData))
}
