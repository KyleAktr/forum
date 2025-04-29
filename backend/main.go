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
		log.Printf("Warning: Erreur lors du chargement du fichier .env: %v", err)
	}

	database.Connect()

	controllers.InitGoogleOAuth()
	uploadsPath := filepath.Join("uploads", "profiles")
	err := os.MkdirAll(uploadsPath, os.ModePerm)
	if err != nil {
		log.Fatal("Erreur lors de la création du dossier uploads:", err)
	}

	r := gin.Default()

	r.Static("/uploads", "./uploads")
	r.Static("/assets", "./assets")

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
			auth.GET("/google", controllers.GoogleLogin)
			auth.GET("/google/callback", controllers.GoogleCallback)
		}

		posts := api.Group("/posts")
		{
			posts.GET("", controllers.GetPosts)
			posts.GET("/:id", controllers.GetPostByID)
			posts.GET("/:id/comments", controllers.GetComments)
			posts.POST("/:id/comments", middleware.AuthMiddleware(), controllers.AddComment)
		}

		postsAuth := posts.Group("/", middleware.AuthMiddleware())
		{
			postsAuth.POST("/:id/reactions", controllers.AddReaction)
			postsAuth.DELETE("/:id/reactions/:reactionId", controllers.RemoveReaction)
			postsAuth.PUT("/:id", controllers.UpdatePost)
		}

		user := api.Group("/user", middleware.AuthMiddleware())
		{
			user.PUT("/profile", controllers.UpdateProfile)
			user.POST("/profile-picture", controllers.UploadProfilePicture)
			user.GET("/:id", controllers.GetUserByID)
			user.DELETE("/delete", controllers.DeleteAccount)

			userPosts := user.Group("/posts")
			{
				userPosts.GET("", controllers.GetUserPosts)
				userPosts.POST("", controllers.CreatePost)
				userPosts.DELETE("/:id", controllers.DeletePost)
			}
		}

		comments := api.Group("/comments")
		{
			comments.PUT("/:id", middleware.AuthMiddleware(), controllers.UpdateComment)
			comments.DELETE("/:id", middleware.AuthMiddleware(), controllers.DeleteComment)
		}
	}

	// Démarrage du serveur
	log.Fatal(r.Run(":8080"))
}
