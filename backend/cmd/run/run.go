package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"example.com/shortener/internal/database"
	"example.com/shortener/internal/routes"
	"github.com/joho/godotenv"
)

const PORT = "8080"

func init() {
	// Load .env variables
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalln("could not load env", err)
	}

	// Initialize redis connection
	database.InitRedis()
	if err := database.Redis.Set(context.Background(), "apiKey", os.Getenv("API_KEY"), 0).Err(); err != nil {
		log.Fatalln("could not set apiKey", err)
	}
}

func main() {
	log.Printf("Starting API on port %s\n", PORT)
	http.ListenAndServe(fmt.Sprintf(":%s", PORT), routes.CreateRouter())
}
