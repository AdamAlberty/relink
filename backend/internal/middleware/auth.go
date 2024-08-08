package middleware

import (
	"crypto/subtle"
	"net/http"

	"example.com/shortener/internal/database"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKeyFromRequest := r.Header.Get("Authorization")
		apiKey, err := database.Redis.Get(r.Context(), "apiKey").Result()
		if err != nil {
			http.Error(w, "Authentication failed", http.StatusUnauthorized)
			return
		}
		if apiKeyFromRequest == "" || subtle.ConstantTimeCompare([]byte(apiKeyFromRequest), []byte(apiKey)) != 1 {
			http.Error(w, "Authentication failed", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
