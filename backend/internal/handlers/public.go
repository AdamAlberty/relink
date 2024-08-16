package handlers

import (
	"html/template"
	"log"
	"net/http"

	"example.com/shortener/internal/models"
	"example.com/shortener/internal/types"
	"example.com/shortener/internal/utils"
	"github.com/go-chi/chi/v5"
)

var BadLinkTempl *template.Template

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Relink is running"))
}

// Main shortlink redirecting logic
func HandleShortlinkRedirect(w http.ResponseWriter, r *http.Request) {
	var link = new(types.Link)
	link.Shortpath = chi.URLParam(r, "*")
	link.Domain = r.Host

	// Check if destination exists
	err := models.GetDestination(link)
	if err != nil {
		log.Println(err)
		BadLinkTempl.Execute(w, nil)
		return
	}

	long, err := utils.MergeQueryParams(r.URL.String(), link.Destination)
	if err != nil {
		log.Println(err)
		utils.JSON(w, "error merging query params", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, long, http.StatusFound)
}
