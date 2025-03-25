package database

import (
	"fmt"
	"forum/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("La variable d'environnement DATABASE_URL n'est pas définie")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Échec de la connexion à la base de données:", err)
	}

	// Migration automatique des schémas
	err = db.AutoMigrate(&models.User{}, &models.Post{}, &models.Comment{}, &models.Category{}, &models.Reaction{})
	if err != nil {
		log.Printf("Attention lors de la migration: %v", err)
		// On continue l'exécution car l'erreur peut être due à des contraintes existantes
	}

	DB = db
	fmt.Println("Connexion à la base de données réussie!")
}
