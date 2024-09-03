# Relink - Super simple multi-domain link shortener

Relink is a simple link shortener built with **Go** and **Postgres**
with Admin interface built with **Vite React**

> [!CAUTION]  
> This is just a hobby project that, as of now, should not be used for production.

## Architecture

- backend - main part, written in Go, redirects links and exposes REST API
- Admin web interface - connects to the REST API for managing shortlinks

The REST API is on `/_api` path and the web admin is on `/_admin`.

The backend and admin are stateless. The only state is stored in the database, so it's easy to scale to multiple nodes.

## Installation

The simplest way to setup Relink would be to use Docker.

1. First, clone the repository
2. Copy `.env.example` to `.env` and change values accordingly
3. Run `docker compose build` and `docker compose up`
4. Then you can start adding shortlinks through web client or directly through the REST API

## Using with reverse proxy

You probably want to have these services behind a reverse proxy.

You can tweak to docker-compose file to include caddy and configure it like that.

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
