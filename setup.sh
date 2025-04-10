#!/bin/bash

# Install poetry if not installed
if ! command -v poetry &> /dev/null; then
    echo "Installing poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
fi

echo "Setting up backend environment..."
cd backend
poetry install

echo "Setting up google_maps_agent..."
cd ../google_maps_agent
poetry install

# Create .env file if it doesn't exist
cd ..
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "GOOGLE_MAPS_API_KEY=your_api_key_here" > .env
    echo "KLUSTER_AI_API_KEY=your_kluster_ai_api_key_here" >> .env
    echo "Created .env file. Please update your API keys."
fi

# Install frontend dependencies
echo "Setting up frontend environment..."
cd frontend
npm install

echo "Setup complete! Don't forget to:"
echo "1. Update your Google Maps API key in the .env file"
echo "2. Update your Kluster AI API key in the .env file"
echo "3. Run the application with: ./start.sh" 