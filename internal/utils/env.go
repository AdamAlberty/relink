package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadENV() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalln("ERR: could not load env", err)
	}
}

func CheckENV() {
	isError := false
	if os.Getenv("PORT") == "" {
		log.Println("INFO: PORT env variable not specified, defaulting to port 8080")
		if err := os.Setenv("PORT", "8080"); err != nil {
			log.Fatalln("FATAL: could not set defaut port", err)
		}
	}

	if len(os.Getenv("AUTH_USERNAME")) < 1 {
		isError = true
		log.Println("ERR: AUTH_USERNAME not set")
	}

	if isError {
		log.Fatalln("FATAL: check env variables")
	}
}
