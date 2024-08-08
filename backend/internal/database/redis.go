package database

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var Redis *redis.Client

func InitRedis() {
	Redis = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_URL"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	_, err := Redis.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalln("Error connecting to Redis:", err)
	}
}
