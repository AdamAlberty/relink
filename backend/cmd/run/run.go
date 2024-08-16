package main

import (
	"fmt"
	"log"
	"net/http"

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
	database.InitDB()
}

func main() {
	log.Printf("Starting Relink API on port %s\n", PORT)
	http.ListenAndServe(fmt.Sprintf(":%s", PORT), routes.CreateRouter())
}
