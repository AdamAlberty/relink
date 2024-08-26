package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitDB() {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalln("Error connecting to DB:", err)
	}
	DB = dbpool
	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatalln("Error connecting to DB:", err)
	}

	schema, err := os.ReadFile("schema.sql")
	if err != nil {
		log.Fatalln("Could not read schema:", err)
	}
	_, err = dbpool.Exec(context.Background(), string(schema))
	if err != nil {
		log.Fatalln("Could not push schema:", err)
	}
}
