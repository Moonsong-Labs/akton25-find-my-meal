#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd backend
poetry run uvicorn main:app --reload --port 8001 &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev

# When frontend server stops, kill the backend server
kill $BACKEND_PID 