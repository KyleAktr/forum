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

	"github.com/gin-gonic/gin"
)

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
