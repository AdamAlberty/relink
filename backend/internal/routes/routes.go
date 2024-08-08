package routes

import (
	"example.com/shortener/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func CreateRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Redirecting
	r.Group(PublicRoutes)

	// API used by client
	r.With(middleware.AuthMiddleware).Route("/api", ProtectedRoutes)

	return r

}
