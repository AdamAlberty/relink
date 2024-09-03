package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"example.com/shortener/internal/models"
	"example.com/shortener/internal/types"
	"example.com/shortener/internal/utils"
)

func HandleImport(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(1024 * 1024 * 5) // 5 MiB
	if err != nil {
		utils.JSON(w, map[string]any{"message": err}, http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("import")
	if err != nil {
		utils.JSON(w, map[string]any{"message": err}, http.StatusBadRequest)
		return
	}
	defer file.Close()

	links := make([]types.Link, 0)
	err = json.NewDecoder(file).Decode(&links)
	if err != nil {
		utils.JSON(w, map[string]any{"message": err}, http.StatusBadRequest)
		return
	}

	for _, link := range links {
		if err := models.SaveLink(&link); err != nil {
			continue
		}
	}

	utils.JSON(w, map[string]any{
		"message": "links imported successfully",
	}, http.StatusCreated)
}

func HandleExport(w http.ResponseWriter, r *http.Request) {
	links, err := models.GetLinks()
	if err != nil {
		utils.JSON(w, map[string]any{"message": "could not get links"}, http.StatusInternalServerError)
		return
	}

	linksWithoutID := make([]map[string]any, len(links))
	for i, link := range links {
		mp := make(map[string]any)
		mp["domain"] = link.Domain
		mp["destination"] = link.Destination
		mp["shortpath"] = link.Shortpath
		linksWithoutID[i] = mp
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", "attachment;filename=export.json")
	formattedJSON, err := json.MarshalIndent(linksWithoutID, "", "  ")
	if err != nil {
		utils.JSON(w, fmt.Sprintf("could not write links for exporting: %s", err), http.StatusInternalServerError)
		return
	}

	_, err = w.Write(formattedJSON)
	if err != nil {
		utils.JSON(w, fmt.Sprintf("could not write links for exporting: %s", err), http.StatusInternalServerError)
		return
	}
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

	if len(payload.Domain) < 1 || len(payload.Shortpath) < 1 || len(payload.Destination) < 1 {
		utils.JSON(w, "input validation failed", http.StatusBadRequest)
		return
	}

	err := models.SaveLink(payload)
	if err != nil {
		utils.JSON(w, fmt.Sprintf("could not save link: %s", err), http.StatusInternalServerError)
		return
	}

	utils.JSON(w, "link created successfully", http.StatusCreated)
}

func HandleUpdateLink(w http.ResponseWriter, r *http.Request) {
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
	if err := json.NewDecoder(r.Body).Decode(&id); err != nil {
		utils.JSON(w, map[string]any{
			"message": fmt.Sprintf("Could not delete link: %s", err),
		}, http.StatusBadRequest)
		return
	}
	if err := models.DeleteLink(id); err != nil {
		utils.JSON(w, map[string]any{
			"message": fmt.Sprintf("Could not delete link: %s", err),
		}, http.StatusInternalServerError)
		return
	}
	utils.JSON(w, map[string]any{"message": "Link deleted successfully"}, http.StatusOK)
}
