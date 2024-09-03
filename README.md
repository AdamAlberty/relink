# Relink - Super simple multi-domain link shortener

Relink is a simple link shortener built with **Go**, with Admin interface built with **Vite React** and using **Postgres** to store shortlinks.

> [!CAUTION]  
> This is just a hobby project that, as of now, should not be used for production.

## Components

- Backend - main part, written in Go, redirects links and exposes REST API
- Admin web interface - created with Vite + React TS, connects to the REST API for managing shortlinks (part of the backend, but can be removed)
- Postgres database - for storing shortlinks. The only state is stored in the database, so it's easy to scale to multiple nodes.

The REST API is on `/_api` route and the web admin is on `/_admin` route.

## Installation

The simplest way to setup Relink would be to use Docker.

1. First, clone the repository
2. Copy `.env.example` to `.env` and change values accordingly
3. Run `docker compose build` and `docker compose up`
4. Then you can start adding shortlinks through web client on `/_admin` or directly through the REST API

## Using with reverse proxy

You probably want to have these services behind a reverse proxy.

### Caddy

```
<relink-domain-1>, <relink-domain-2>, <relink-domain-3>  {
	reverse_proxy localhost:8080
}
```

## Benchmarks

TODO

## Contributing

Feel free to contribute to this project.

## Roadmap

- Generate link qr code
