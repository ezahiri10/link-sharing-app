.PHONY: help install dev-client dev-server

help:
	@echo "Link Sharing App - Available Commands"
	@echo ""
	@echo "  make install      - Install dependencies"
	@echo "  make dev-client   - Run client dev server (http://localhost:5173)"
	@echo "  make dev-server   - Run server dev server (http://localhost:3000)"

install:
	@echo "Installing client dependencies..."
	@flatpak-spawn --host bash -c "source ~/.nvm/nvm.sh && cd /home/ezahiri/link-sharing-app/client && npm install"
	@echo "Installing server dependencies..."
	@flatpak-spawn --host bash -c "source ~/.nvm/nvm.sh && cd /home/ezahiri/link-sharing-app/server && npm install"
	@echo "✅ Dependencies installed!"

dev-client:
	@echo "🚀 Starting client dev server..."
	@flatpak-spawn --host bash -c "source ~/.nvm/nvm.sh && cd /home/ezahiri/link-sharing-app/client && npm run dev"

dev-server:
	@echo "🚀 Starting server dev server..."
	@flatpak-spawn --host bash -c "source ~/.nvm/nvm.sh && cd /home/ezahiri/link-sharing-app/server && npm run dev"
