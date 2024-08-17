# Relink - Super simple link shortener

Relink is a simple link shortener built with **Go** and **Postgres**
with Admin interface built with **Next.js**

> [!CAUTION]  
> This is just a hobby project that, as of now, should not be used for production.

## Architecture

- backend - main part written in Go, redirects links and exposes REST API for configuration for admin
- client (optional) - connects to the REST API for managing shortlinks

You can use the included web admin, or create your own through interacting with the REST API.

## Installation

The simplest way to setup Relink would be to use Docker.

1. First, clone the repository
2. Edit environment variables in `.env` and `./backend/.env`
3. Run `docker compose build` and `docker compose up`
4. Then you can start adding shortlinks through web client or directly through the REST API

## Using with reverse proxy

You probably want to have these services behind a reverse proxy.

You can tweak to docker-compose file to include caddy and configure it like that.

### Caddy

```
<relink-backend-domain> {
	reverse_proxy localhost:8080
}

<relink-client-domain> {
	reverse_proxy localhost:3000
}
```

## Configuration

```
// .env
REDIS_PASSWORD=<redis-password>
```

```
// ./backend/.env
REDIS_PASSWORD=<redis-password>
REDIS_URL="redis:6379"
API_KEY=<secret-key>
```

> [!TIP]  
> You can generate secret API key by running `openssl rand -base64 42`

## Benchmarks

TODO

## Contributing

Feel free to contribute to this project.

## Roadmap

- Generate link qr code
