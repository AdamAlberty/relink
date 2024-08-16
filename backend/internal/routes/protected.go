package routes

import (
	"example.com/shortener/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func ProtectedRoutes(r chi.Router) {
	r.Post("/verify", handlers.HandleVerifyAuth)

	r.Post("/import", handlers.HandleImport)
	r.Post("/export", handlers.HandleExport)

	r.Get("/links", handlers.HandleGetLinks)
	r.Post("/links", handlers.HandleCreateLink)
	r.Put("/links", handlers.HandleEditLink)
	r.Delete("/links", handlers.HandleDeleteLink)
}
