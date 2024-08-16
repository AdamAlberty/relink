package handlers

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"example.com/shortener/internal/models"
	"example.com/shortener/internal/types"
	"example.com/shortener/internal/utils"
)

func HandleVerifyAuth(w http.ResponseWriter, r *http.Request) {
	utils.JSON(w, "authenticated", http.StatusOK)
}

func HandleImport(w http.ResponseWriter, r *http.Request) {
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
	errorCount := 0
	for scanner.Scan() {
		shortlink := strings.Split(scanner.Text(), ",")
		if len(shortlink) < 3 {
			errorCount++
			continue
		}

		link := types.Link{
			Domain:      shortlink[0],
			Shortpath:   shortlink[1],
			Destination: shortlink[2],
		}

		if err := models.SaveLink(&link); err != nil {
			errorCount++
			continue
		}
	}

	utils.JSON(w, map[string]any{
		"message": fmt.Sprintf("links imported successfully (%d links could not be imported)", errorCount),
	}, http.StatusCreated)
}

func HandleExport(w http.ResponseWriter, r *http.Request) {
	links, err := models.GetLinks()
	if err != nil {
		utils.JSON(w, map[string]any{"message": "could not get links"}, http.StatusInternalServerError)
		return
	}

	csvwriter := csv.NewWriter(w)
	for _, link := range links {
		_ = csvwriter.Write([]string{link.Domain, link.Shortpath, link.Destination})
	}
	csvwriter.Flush()
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment;filename=shortlinks_export.csv")
}

func HandleGetLinks(w http.ResponseWriter, r *http.Request) {
	links, err := models.GetLinks()
	if err != nil {
		utils.JSON(w, fmt.Sprintf("could not get links: %s", err), http.StatusInternalServerError)
		return
	}
	utils.JSON(w, links, http.StatusOK)
}

func HandleCreateLink(w http.ResponseWriter, r *http.Request) {
	payload := new(types.Link)

	if err := json.NewDecoder(r.Body).Decode(payload); err != nil {
		utils.JSON(w, fmt.Sprintf("bad payload: %s", err), http.StatusBadRequest)
		return
	}

	err := models.SaveLink(payload)
	if err != nil {
		utils.JSON(w, fmt.Sprintf("could not save link: %s", err), http.StatusInternalServerError)
		return
	}

	utils.JSON(w, "link created successfully", http.StatusCreated)
}

func HandleEditLink(w http.ResponseWriter, r *http.Request) {
	payload := new(struct {
		Id          int    `json:"id"`
		Domain      string `json:"domain"`
		Shortpath   string `json:"shortpath"`
		Destination string `json:"destination"`
	})

	if err := json.NewDecoder(r.Body).Decode(payload); err != nil {
		utils.JSON(w, fmt.Sprintf("bad payload: %s", err), http.StatusBadRequest)
		return
	}

	err := models.EditLink(payload.Id, &types.Link{
		Domain:      payload.Domain,
		Shortpath:   payload.Shortpath,
		Destination: payload.Destination,
	})
	if err != nil {
		utils.JSON(w, fmt.Sprintf("could not update link: %s", err), http.StatusInternalServerError)
		return
	}

	utils.JSON(w, "link updated successfully", http.StatusOK)
}

func HandleDeleteLink(w http.ResponseWriter, r *http.Request) {
	var id int
	json.NewDecoder(r.Body).Decode(&id)

	if err := models.DeleteLink(id); err != nil {
		utils.JSON(w, fmt.Sprintf("could not delete link: %s", err), http.StatusInternalServerError)
		return
	}

	utils.JSON(w, "link deleted successfully", http.StatusOK)
}
