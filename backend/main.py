"""
FastAPI backend for restaurant search.
Created: 2024-03-21
Changes:
- Added Kluster AI processing for query optimization
- Added logging to API endpoints
- Added test endpoint
- Using FastAPI's built-in development server
- Fixed import statement
- Updated to use correct RestaurantFinderAgent class
- Updated to use OpenAI client with Kluster's LLaMA
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from google_maps_agent.agent import RestaurantFinderAgent
import os
import logging
import json
from dotenv import load_dotenv
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI client with Kluster configuration
client = OpenAI(
    api_key=os.getenv('KLUSTER_AI_API_KEY'),
    base_url="https://api.kluster.ai/v1"
)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the agent
agent = RestaurantFinderAgent()

class SearchRequest(BaseModel):
    query: str

class Restaurant(BaseModel):
    name: str
    place_id: str
    rating: float
    user_ratings_total: int
    vicinity: str
    formatted_address: Optional[str] = None
    website: Optional[str] = None
    formatted_phone_number: Optional[str] = None
    opening_hours: Optional[dict] = None
    geometry: dict

class SearchStrategy(BaseModel):
    location: str
    radius: int
    type: str
    keyword: Optional[str] = None
    open_now: Optional[bool] = None
    min_rating: Optional[float] = None
    max_price: Optional[int] = None

class Analysis(BaseModel):
    matching_factors: List[str]
    concerns: List[str]
    score: float
    recommendations: Optional[str] = None

class SearchResult(BaseModel):
    strategy: SearchStrategy
    restaurants: List[Restaurant]
    analysis: Analysis

def optimize_query_with_llama(query: str) -> str:
    """Use LLaMA to optimize the search query for Google Maps MCP."""
    try:
        completion = client.chat.completions.create(
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            max_completion_tokens=200,
            temperature=0.5,  # Increased temperature for more creativity
            top_p=1,
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert in Google Maps search optimization, focused on finding restaurants even when exact matches aren't available. Your goal is to help users find good dining options by:

1. Prioritizing finding SOME results over perfect matches
2. Breaking down complex queries into simpler, more searchable terms
3. Being flexible with location specifics while staying in the general area
4. Removing overly specific constraints that might limit results

Guidelines for query optimization:
- Keep the essential location but simplify it (e.g., neighborhood name is often enough)
- Preserve the main cuisine type but remove overly specific requirements
- Focus on the core search intent
- If a query seems too specific, generalize it to ensure results
- Consider nearby areas if exact location might be too restrictive

Example transformations:
- "Authentic Peruvian cevicheria in Belgrano near Av. Cabildo" → "Peruvian restaurant Belgrano"
- "High-end sushi with omakase near Palermo Soho" → "sushi restaurant Palermo"
- "Traditional Italian with homemade pasta in Recoleta" → "Italian restaurant Recoleta"

Return ONLY the optimized search query, no explanations."""
                },
                {
                    "role": "user",
                    "content": f"Make this restaurant search query more likely to find results while keeping the essential intent: {query}"
                }
            ]
        )
        
        optimized_query = completion.choices[0].message.content.strip()
        logger.info(f"LLaMA optimized query: {optimized_query}")
        return optimized_query
    except Exception as e:
        logger.error(f"Error optimizing query with LLaMA: {str(e)}")
        return query

def analyze_with_llama(query: str, restaurants: List[Dict[str, Any]]) -> str:
    """Use LLaMA to analyze restaurants and provide personalized recommendations."""
    try:
        # Prepare restaurant details
        restaurant_details = []
        for r in restaurants:
            details = {
                "name": r.get("name", "Unknown"),
                "rating": r.get("rating", 0),
                "reviews": r.get("user_ratings_total", 0),
                "address": r.get("vicinity", "Unknown location"),
                "opening_hours": r.get("opening_hours", {}),
                "website": r.get("website", "Not available"),
                "phone": r.get("formatted_phone_number", "Not available")
            }
            restaurant_details.append(details)

        completion = client.chat.completions.create(
            model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
            max_completion_tokens=1000,
            temperature=0.6,
            top_p=1,
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert restaurant advisor with deep knowledge of:
1. Restaurant evaluation and recommendation
2. Cuisine types and dining experiences
3. Location-based dining options
4. Customer preferences and requirements
5. Special dining considerations

Your task is to analyze restaurant options and provide personalized recommendations based on user preferences."""
                },
                {
                    "role": "user",
                    "content": f"""Analyze these restaurants based on the following user request:

User Query: {query}

Available Restaurants:
{json.dumps(restaurant_details, indent=2)}

Provide:
1. A ranked list of best matches
2. Detailed explanation for each recommendation
3. Important details (contact, hours, etc.)
4. Special considerations and tips

Format your response in a clear, structured way with sections and bullet points."""
                }
            ]
        )
        
        return completion.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error analyzing with LLaMA: {str(e)}")
        return "Unable to generate personalized recommendations at this time."

@app.post("/api/restaurants/search")
async def search_restaurants(request: SearchRequest):
    logger.info(f"Search request received for query: {request.query}")
    try:
        # Optimize the query using LLaMA
        optimized_query = optimize_query_with_llama(request.query)
        logger.info(f"Optimized query: {optimized_query}")
        
        try:
            # Get the search results from the agent
            results = agent.find_restaurants(optimized_query)
            logger.info(f"Search completed successfully. Found {len(results['restaurants'])} results")
            
            # Only run LLaMA analysis if we have restaurants
            if results['restaurants']:
                # Get personalized recommendations using LLaMA
                recommendations = analyze_with_llama(request.query, results['restaurants'])
                logger.info("Generated personalized recommendations")
                
                # Add recommendations to the results
                if 'analysis' not in results:
                    results['analysis'] = {
                        'matching_factors': [],
                        'concerns': [],
                        'score': 0.0
                    }
                results['analysis']['recommendations'] = recommendations
            else:
                # No restaurants found, set empty analysis
                results['analysis'] = {
                    'matching_factors': [],
                    'concerns': ['No restaurants found in this area'],
                    'score': 0.0,
                    'recommendations': 'No restaurants found. Try adjusting your search criteria or location.'
                }
            
            return results
            
        except ValueError as e:
            # Handle specific errors from the agent
            logger.warning(f"Search failed with ValueError: {str(e)}")
            return {
                'restaurants': [],
                'strategy': {
                    'location': optimized_query,
                    'radius': 5000,
                    'type': 'restaurant'
                },
                'analysis': {
                    'matching_factors': [],
                    'concerns': [str(e)],
                    'score': 0.0,
                    'recommendations': 'Try adjusting your search criteria or location.'
                }
            }
            
    except Exception as e:
        logger.error(f"Error searching restaurants: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/restaurants/{place_id}")
async def get_restaurant_details(place_id: str):
    try:
        details = agent._get_place_details(place_id)
        if not details:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Restaurant Finder API is running"}

@app.get("/api/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return {
        "status": "ok",
        "version": "1.0.0",
        "api_key_configured": bool(os.getenv("GOOGLE_MAPS_API_KEY"))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 