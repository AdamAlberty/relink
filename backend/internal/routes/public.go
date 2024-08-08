package routes

import (
	"html/template"

	"example.com/shortener/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func PublicRoutes(r chi.Router) {
	handlers.BadLinkTempl = template.Must(template.ParseFiles("internal/views/bad-link.html"))

	r.Get("/", handlers.HandleStatus)
	r.Get("/*", handlers.HandleShortlinkRedirect)
}
