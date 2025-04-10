.PHONY: setup install-backend install-frontend start-backend start-frontend start stop clean help

# Default target
all: setup start

# Setup development environment
setup: install-backend install-frontend

# Install backend dependencies
install-backend:
	@echo "Setting up backend environment..."
	cd backend && poetry lock && poetry install
	@echo "Setting up google_maps_agent..."
	cd google_maps_agent && poetry lock && poetry install

# Install frontend dependencies
install-frontend:
	@echo "Setting up frontend environment..."
	cd frontend && npm install

# Start backend server
start-backend:
	@echo "Starting backend server..."
	cd backend && poetry run uvicorn main:app --reload --port 8001

# Start frontend server
start-frontend:
	@echo "Starting frontend server..."
	cd frontend && npm run dev

# Start both servers in parallel
start:
	@echo "Starting both servers..."
	@make -j 2 start-backend start-frontend

# Stop all servers
stop:
	@echo "Stopping all servers..."
	@pkill -f "uvicorn main:app" || true
	@pkill -f "next dev" || true

# Clean up
clean:
	@echo "Cleaning up..."
	@rm -rf frontend/node_modules
	@rm -rf frontend/.next
	@rm -rf google_maps_agent/*.egg-info
	@rm -rf google_maps_agent/__pycache__
	@rm -rf google_maps_agent/*/__pycache__
	@rm -rf backend/__pycache__
	@rm -rf backend/*/__pycache__

# Help target
help:
	@echo "Available targets:"
	@echo "  setup           - Set up both frontend and backend environments"
	@echo "  install-backend - Install backend dependencies"
	@echo "  install-frontend - Install frontend dependencies"
	@echo "  start-backend   - Start the backend server"
	@echo "  start-frontend  - Start the frontend server"
	@echo "  start          - Start both servers in parallel"
	@echo "  stop           - Stop all servers"
	@echo "  clean          - Clean up all generated files"
	@echo "  help           - Show this help message" 