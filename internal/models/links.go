package models

import (
	"context"

	"example.com/shortener/internal/database"
	"example.com/shortener/internal/types"
)

func SaveLink(link *types.Link) error {
	_, err := database.DB.Exec(context.Background(), "INSERT INTO links (domain, shortpath, destination)  VALUES ($1, $2, $3)", link.Domain, link.Shortpath, link.Destination)
	return err
}

func DeleteLink(id int) error {
	_, err := database.DB.Exec(context.Background(), "DELETE FROM links WHERE id = $1", id)
	return err
}

func EditLink(id int, link *types.Link) error {
	_, err := database.DB.Exec(context.Background(), "UPDATE links SET domain = $1, shortpath = $2, destination = $3 WHERE id = $4", link.Domain, link.Shortpath, link.Destination, id)
	return err
}

func GetLinks() ([]types.Link, error) {
	links := make([]types.Link, 0)
	rows, err := database.DB.Query(context.Background(), "SELECT id, domain, shortpath, destination FROM links ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}

	link := new(types.Link)
	for rows.Next() {
		if err := rows.Scan(&link.Id, &link.Domain, &link.Shortpath, &link.Destination); err != nil {
			return links, nil
		}
		links = append(links, *link)
	}

	return links, nil
}

func GetDestination(link *types.Link) error {
	row := database.DB.QueryRow(context.Background(), "SELECT destination FROM links WHERE domain = $1 AND shortpath = $2", link.Domain, link.Shortpath)
	return row.Scan(&link.Destination)
}
