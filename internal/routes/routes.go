package routes

import (
	"html/template"
	"net/http"

	"example.com/shortener/internal/handlers"
	"example.com/shortener/internal/middleware"
)

func CreateRouter() *http.ServeMux {
	handlers.BadLinkTempl = template.Must(template.ParseFiles("views/bad-link.html"))

	r := http.NewServeMux()

	r.HandleFunc("GET /_health", handlers.HandleCheckHealth)
	r.HandleFunc("/", handlers.HandleShortlinkRedirect)

	// Admin
	r.Handle("/_admin/", middleware.AuthMiddleware(http.StripPrefix("/_admin/", http.FileServer(http.Dir("client/dist")))))

	// API
	r.Handle("GET /_api/links", middleware.AuthMiddleware(http.HandlerFunc(handlers.HandleGetLinks)))
	r.Handle("POST /_api/links", middleware.AuthMiddleware(http.HandlerFunc(handlers.HandleCreateLink)))
	r.Handle("PUT /_api/links", middleware.AuthMiddleware(http.HandlerFunc(handlers.HandleUpdateLink)))
	r.Handle("DELETE /_api/links", middleware.AuthMiddleware(http.HandlerFunc(handlers.HandleDeleteLink)))

	r.Handle("POST /_api/import", middleware.AuthMiddleware(http.HandlerFunc(handlers.HandleImport)))
	r.Handle("GET /_api/export", middleware.AuthMiddleware(http.HandlerFunc(handlers.HandleExport)))

	return r
}
