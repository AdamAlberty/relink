package middleware

import (
	"crypto/subtle"
	"net/http"
	"os"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKeyFromRequest := r.Header.Get("Authorization")
		if apiKeyFromRequest == "" || subtle.ConstantTimeCompare([]byte(apiKeyFromRequest), []byte(os.Getenv("API_KEY"))) != 1 {
			http.Error(w, "Authentication failed", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}
