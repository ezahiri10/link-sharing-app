.PHONY: help install install-client install-server dev dev-client dev-server build build-client build-server clean clean-client clean-server

# Default target - show available commands
help:
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies (client + server)"
	@echo "  make install-client - Install client dependencies only"
	@echo "  make install-server - Install server dependencies only"
	@echo "  make dev           - Run both client and server in development mode"
	@echo "  make dev-client    - Run client in development mode"
	@echo "  make dev-server    - Run server in development mode"
	@echo "  make build         - Build both client and server for production"
	@echo "  make build-client  - Build client for production"
	@echo "  make build-server  - Build server for production"
	@echo "  make clean         - Remove all node_modules and build artifacts"
	@echo "  make clean-client  - Remove client node_modules and build"
	@echo "  make clean-server  - Remove server node_modules and build"

# Install dependencies
install: install-client install-server
	@echo "✅ All dependencies installed"

install-client:
	@echo "📦 Installing client dependencies..."
	@cd client && npm install

install-server:
	@echo "📦 Installing server dependencies..."
	@cd server && npm install

# Development commands
dev:
	@echo "🚀 Starting development servers..."
	@echo "Client: http://localhost:5173"
	@echo "Server: http://localhost:3000"
	@$(MAKE) -j2 dev-client dev-server

dev-client:
	@cd client && npm run dev

dev-server:
	@cd server && npm run dev

# Build commands
build: build-client build-server
	@echo "✅ Build complete"

build-client:
	@echo "🏗️  Building client..."
	@cd client && npm run build

build-server:
	@echo "🏗️  Building server..."
	@cd server && npm run build

# Clean commands
clean: clean-client clean-server
	@echo "✅ Cleanup complete"

clean-client:
	@echo "🧹 Cleaning client..."
	@rm -rf client/node_modules client/dist

clean-server:
	@echo "🧹 Cleaning server..."
	@rm -rf server/node_modules server/dist
