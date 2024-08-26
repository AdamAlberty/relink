package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"example.com/shortener/internal/database"
	"example.com/shortener/internal/routes"
	"example.com/shortener/internal/utils"
)

func init() {
	utils.LoadENV()
	utils.CheckENV()
	database.InitDB()
}

func main() {
	log.Printf("Starting Relink on port %s\n", os.Getenv("PORT"))
	http.ListenAndServe(fmt.Sprintf(":%s", os.Getenv("PORT")), routes.CreateRouter())
}
