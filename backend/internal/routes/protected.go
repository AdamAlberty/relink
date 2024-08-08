package routes

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"example.com/shortener/internal/database"
	"example.com/shortener/internal/models"
	"example.com/shortener/internal/types"
	"example.com/shortener/internal/utils"
	"github.com/go-chi/chi/v5"
)

func ProtectedRoutes(r chi.Router) {
	r.Post("/verify", func(w http.ResponseWriter, r *http.Request) {
		utils.JSON(w, "authenticated", http.StatusOK)
	})

	r.Post("/import", func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(1024 * 1024) // 1 MiB
		if err != nil {
			utils.JSON(w, map[string]any{"message": err}, http.StatusBadRequest)
			return
		}

		file, _, err := r.FormFile("csv")
		if err != nil {
			defer file.Close()
			utils.JSON(w, map[string]any{"message": err}, http.StatusBadRequest)
			return
		}

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			shortlink := strings.Split(scanner.Text(), ",")
			if len(shortlink) < 2 {
				continue
			}
			if err := models.SaveShortlink(&types.Shortlink{
				Short: shortlink[0],
				Long:  shortlink[1],
			}); err != nil {
				continue
			}
		}

		utils.JSON(w, map[string]any{
			"message": "links imported successfully",
		}, http.StatusCreated)
	})

	r.Post("/export", func(w http.ResponseWriter, r *http.Request) {

		links, err := models.GetShortlinks()
		if err != nil {
			utils.JSON(w, map[string]any{"message": "could not get links"}, http.StatusInternalServerError)
			return
		}

		csvwriter := csv.NewWriter(w)
		for _, record := range links {
			_ = csvwriter.Write([]string{record["short"], record["long"]})
		}
		csvwriter.Flush()
		w.Header().Set("Content-Type", "text/csv")
		w.Header().Set("Content-Disposition", "attachment;filename=shortlinks_export.csv")
	})

	r.Get("/links", func(w http.ResponseWriter, r *http.Request) {
		links, err := models.GetShortlinks()
		if err != nil {
			utils.JSON(w, fmt.Sprintf("could not get links: %s", err), http.StatusInternalServerError)
			return
		}
		utils.JSON(w, links, http.StatusOK)
	})

	r.Post("/links", func(w http.ResponseWriter, r *http.Request) {
		payload := new(types.Shortlink)

		if err := json.NewDecoder(r.Body).Decode(payload); err != nil {
			utils.JSON(w, fmt.Sprintf("bad payload: %s", err), http.StatusBadRequest)
			return
		}

		err := models.SaveShortlink(payload)
		if err != nil {
			utils.JSON(w, fmt.Sprintf("could not save to redis: %s", err), http.StatusInternalServerError)
			return
		}

		utils.JSON(w, "link created successfully", http.StatusCreated)
	})

	r.Put("/links", func(w http.ResponseWriter, r *http.Request) {
		payload := new(struct {
			ShortOld string `json:"shortOld"`
			Short    string `json:"short"`
			Long     string `json:"long"`
		})

		if err := json.NewDecoder(r.Body).Decode(payload); err != nil {
			utils.JSON(w, fmt.Sprintf("bad payload: %s", err), http.StatusBadRequest)
			return
		}

		if err := database.Redis.Del(r.Context(), "link:"+payload.ShortOld).Err(); err != nil {
			utils.JSON(w, fmt.Sprintf("could not delete link: %s", err), http.StatusInternalServerError)
			return
		}

		err := database.Redis.HSet(r.Context(), "link:"+payload.Short, map[string]any{
			"short": payload.Short,
			"long":  payload.Long,
		}).Err()

		if err != nil {
			utils.JSON(w, fmt.Sprintf("could not save to redis: %s", err), http.StatusInternalServerError)
			return
		}

		utils.JSON(w, "link created successfully", http.StatusCreated)
	})

	r.Delete("/links", func(w http.ResponseWriter, r *http.Request) {
		var short string
		json.NewDecoder(r.Body).Decode(&short)

		if err := database.Redis.Del(r.Context(), "link:"+short).Err(); err != nil {
			utils.JSON(w, fmt.Sprintf("could not delete shortlink: %s", err), http.StatusInternalServerError)
			return
		}

		utils.JSON(w, "shortlink deleted successfully", http.StatusOK)
	})
}
