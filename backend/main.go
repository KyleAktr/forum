package main

import (
	"forum/controllers"
	"forum/database"
	"log"
	"net/http"

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

	r := gin.Default()

	// Configuration CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Routes
	api := r.Group("/api")
	{
		// Route de test
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status": "ok",
			})
		})

		// Routes d'authentification
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		//routes des posts
		posts := api.Group("/posts")
		{
			posts.GET("/", controllers.GetPosts)
			posts.POST("/", controllers.CreatePost)
			// Routes à implémenter :
			// posts.GET("/:id", controllers.GetPost)
			// posts.PUT("/:id", controllers.UpdatePost)
			// posts.DELETE("/:id", controllers.DeletePost)
			// posts.POST("/:id/reactions", controllers.CreateReaction)
			// posts.POST("/:id/comments", controllers.CreateComment)
			// posts.GET("/:id/comments", controllers.GetComments)
		}

		log.Fatal(r.Run(":8080"))
	}
}
