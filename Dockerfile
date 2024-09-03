# Stage 1: Build web admin
FROM node:alpine AS client-build

WORKDIR /client

COPY ./client/package*.json ./
RUN npm install --production

COPY ./client ./
RUN npm run build

# Stage 2: Build the server
FROM golang:alpine AS go-build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /app/relink ./cmd/start


# Final Stage: Minimal Image
FROM alpine:latest

WORKDIR /app

# Copy the binary and client from the previous stage
COPY ./.env .
COPY --from=go-build /app/relink .
COPY --from=client-build /client ./client

# Clean up any unnecessary files (if needed)
RUN apk --no-cache add ca-certificates

CMD ["/app/relink"]