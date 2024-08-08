package models

import (
	"context"

	"example.com/shortener/internal/database"
	"example.com/shortener/internal/types"
)

func SaveShortlink(shortlink *types.Shortlink) error {
	return database.Redis.HSet(context.Background(), "link:"+shortlink.Short, map[string]any{
		"short": shortlink.Short,
		"long":  shortlink.Long,
	}).Err()
}

func GetShortlinks() ([]map[string]string, error) {
	links := make([]map[string]string, 0)
	iter := database.Redis.Scan(context.Background(), 0, "link:*", 0).Iterator()

	for iter.Next(context.Background()) {
		link, err := database.Redis.HGetAll(context.Background(), iter.Val()).Result()
		if err != nil {
			return nil, err
		}
		links = append(links, link)
	}
	return links, nil
}

func CheckShortlinkExists(short string) (bool, error) {
	exists, err := database.Redis.Exists(context.Background(), "link:"+short).Result()
	return exists != 0, err
}
