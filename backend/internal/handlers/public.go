package handlers

import (
	"html/template"
	"log"
	"net/http"

	"example.com/shortener/internal/database"
	"example.com/shortener/internal/models"
	"example.com/shortener/internal/utils"
	"github.com/go-chi/chi/v5"
)

var BadLinkTempl *template.Template

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Relink is running"))
}

// Main shortlink redirecting logic
func HandleShortlinkRedirect(w http.ResponseWriter, r *http.Request) {
	short := chi.URLParam(r, "*")

	// Check if shortlink exists
	exists, err := models.CheckShortlinkExists(short)

	if err != nil {
		log.Println(err)
		utils.JSON(w, "error checking if link exists", http.StatusInternalServerError)
		return
	}

	if !exists {
		BadLinkTempl.Execute(w, nil)
		return
	}

	link, err := database.Redis.HGetAll(r.Context(), "link:"+short).Result()
	if err != nil {
		log.Println(err)
		utils.JSON(w, "error retrieving link", http.StatusInternalServerError)
		return
	}

	long, err := utils.MergeQueryParams(r.URL.String(), link["long"])
	if err != nil {
		log.Println(err)
		utils.JSON(w, "error merging query params", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, long, http.StatusFound)
}
