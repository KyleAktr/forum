package main

import (
	"forum/controllers"
	"forum/database"
	"forum/middleware"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Chargement des variables d'environnement
	if err := godotenv.Load(); err != nil {
		log.Fatal("Erreur lors du chargement du fichier .env")
	}

	// Connexion à la base de données
	database.Connect()

	uploadsPath := filepath.Join("uploads", "profiles")
	err := os.MkdirAll(uploadsPath, os.ModePerm)
	if err != nil {
		log.Fatal("Erreur lors de la création du dossier uploads:", err)
	}

	r := gin.Default()

	r.Static("/uploads", "./uploads")

	// Configuration CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:8080"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}

	r.Use(cors.New(config))

	// Routes
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status": "ok",
			})
		})

		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		posts := api.Group("/posts")
		posts.GET("", controllers.GetPosts)

		user := api.Group("/user", middleware.AuthMiddleware())
		user.PUT("/profile", controllers.UpdateProfile)
		user.POST("/profile-picture", controllers.UploadProfilePicture)

		userPosts := user.Group("/posts")
		userPosts.GET("", controllers.GetUserPosts)
		userPosts.POST("", controllers.CreatePost)
	}

	// Démarrage du serveur
	log.Fatal(r.Run(":8080"))
}
