# find-my-meal
It’s late on a Friday night, you’re hungry, and your significant other hits you with the question: “Where should we eat?”. The familiar spiral of indecision starts. Instead of drowning in endless Google searches, scrolling through reviews, and debating menus, let Find My Meal take charge.

## Features

- Natural language restaurant search
- Query optimization using Kluster AI
- Real-time search results from Google Maps
- Detailed restaurant information
- Modern, responsive UI

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Python, FastAPI
- AI: Kluster AI for query optimization
- Maps: Google Maps API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create `.env.local` in the frontend directory:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```
   - Create `.env` in the backend directory:
     ```
     GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     KLUSTER_API_KEY=your_kluster_api_key
     ```

4. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd ../backend
   uvicorn main:app --reload
   ```

## How It Works

1. User enters a natural language query (e.g., "Find me a cozy Italian restaurant with outdoor seating")
2. The query is sent to Kluster AI for optimization
3. Kluster AI converts the natural language into a structured Google Maps search query
4. The optimized query is used to search Google Maps
5. Results are displayed to the user with detailed restaurant information

## API Endpoints

- `POST /api/restaurants/search`: Search for restaurants using natural language
  - Request body: `{ "query": "your search query" }`
  - Response: List of restaurants with details

## License

MIT 