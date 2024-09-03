CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    domain TEXT NOT NULL,
    shortpath TEXT NOT NULL,
    destination TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (domain, shortpath)
);