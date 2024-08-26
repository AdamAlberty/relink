package handlers

import (
	"net/http"

	"example.com/shortener/internal/utils"
)

func HandleCheckHealth(w http.ResponseWriter, r *http.Request) {
	utils.JSON(w, "HEALTHY", http.StatusOK)
}
