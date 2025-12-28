DOCKER_COMPOSE := $(shell command -v docker-compose 2> /dev/null)
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := docker compose
endif

.PHONY: help install dev build up down restart logs clean migrate test

help:
	@echo "DevLinks - Available Commands:"
	@echo "  make install    - Install dependencies for client and server"
	@echo "  make dev        - Run development servers (client + server)"
	@echo "  make build      - Build Docker images"
	@echo "  make up         - Start all containers"
	@echo "  make down       - Stop all containers"
	@echo "  make restart    - Restart all containers"
	@echo "  make logs       - Show container logs"
	@echo "  make clean      - Remove containers, images, and volumes"
	@echo "  make migrate    - Run database migrations"
	@echo "  make ps         - Show running containers"
	@echo "  make shell-db   - Access PostgreSQL shell"
	@echo "  make shell-api  - Access server container shell"

install:
	@echo "📦 Installing client dependencies..."
	cd client && npm install
	@echo "📦 Installing server dependencies..."
	cd server && npm install
	@echo "✅ Dependencies installed!"

dev:
	@echo "🚀 Starting development servers..."
	@echo "Starting server on http://localhost:3000"
	@echo "Starting client on http://localhost:5173"
	@(cd server && npm run dev) & (cd client && npm run dev)

build:
	@echo "🏗️  Building Docker images..."
	$(DOCKER_COMPOSE) build --no-cache
	@echo "✅ Build complete!"

up:
	@echo "🚀 Starting containers..."
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Containers started!"
	@echo "🌐 Client: http://localhost:80"
	@echo "🔗 Server: http://localhost:3000"
	@echo "🗄️  Database: localhost:5432"

down:
	@echo "🛑 Stopping containers..."
	$(DOCKER_COMPOSE) down
	@echo "✅ Containers stopped!"

restart:
	@echo "🔄 Restarting containers..."
	$(DOCKER_COMPOSE) restart
	@echo "✅ Containers restarted!"

logs:
	$(DOCKER_COMPOSE) logs -f

logs-client:
	$(DOCKER_COMPOSE) logs -f client

logs-server:
	$(DOCKER_COMPOSE) logs -f server

logs-db:
	$(DOCKER_COMPOSE) logs -f postgres

ps:
	$(DOCKER_COMPOSE) ps

clean:
	@echo "🧹 Cleaning up..."
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -f
	@echo "✅ Cleanup complete!"

clean-all:
	@echo "🧹 Deep cleaning (removes everything)..."
	$(DOCKER_COMPOSE) down -v --rmi all --remove-orphans
	docker system prune -af --volumes
	@echo "✅ Deep cleanup complete!"

migrate:
	@echo "🔄 Running database migrations..."
	cd server && npm run migrate
	@echo "✅ Migrations complete!"

migrate-profile:
	@echo "🔄 Running profile email migration..."
	cd server && npm run migrate:profile-email
	@echo "✅ Profile migration complete!"

shell-db:
	docker exec -it devlinks-db psql -U devlinks -d devlinks

shell-server:
	docker exec -it devlinks-server sh

shell-client:
	docker exec -it devlinks-client sh

health:
	@echo "🏥 Checking container health..."
	@docker ps --filter "name=devlinks" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

rebuild:
	@echo "🔨 Rebuilding and restarting..."
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Rebuild complete!"

backup-db:
	@echo "💾 Backing up database..."
	docker exec devlinks-db pg_dump -U devlinks devlinks > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created!"

restore-db:
	@echo "📥 Restoring database from $(file)..."
	docker exec -i devlinks-db psql -U devlinks devlinks < $(file)
	@echo "✅ Database restored!"
