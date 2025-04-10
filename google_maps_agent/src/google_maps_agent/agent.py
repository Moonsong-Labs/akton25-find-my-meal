"""
Restaurant finder agent using Google Maps API.
Created: 2024-03-21
Changes:
- Initial implementation of RestaurantFinderAgent class
- Added better handling of ZERO_RESULTS and location validation
"""

import json
import logging
import re
from typing import Dict, List, Optional, Tuple, Union

import requests
from dotenv import load_dotenv
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RestaurantFinderAgent:
    """Agent for finding and analyzing restaurants using Google Maps API."""
    
    def __init__(self):
        """Initialize the agent with API configuration."""
        load_dotenv()
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_MAPS_API_KEY environment variable not set")
        
        self.base_url = "https://maps.googleapis.com/maps/api/place"
        self.search_url = f"{self.base_url}/textsearch/json"
        self.details_url = f"{self.base_url}/details/json"
        
    def find_restaurants(self, query: str) -> Dict[str, Union[List[Dict], str]]:
        """
        Find restaurants based on the given query.
        
        Args:
            query: Search query string (e.g., "Japanese food in Belgrano")
            
        Returns:
            Dictionary containing search results and analysis
        """
        try:
            # Search for places
            places = self._search_places(query)
            if not places:
                return {
                    "restaurants": [],
                    "strategy": {
                        "location": "current location",
                        "radius": 5000,
                        "type": "restaurant",
                        "keyword": None,
                        "open_now": True,
                        "min_rating": 4.0,
                        "max_price": None
                    },
                    "analysis": {
                        "matching_factors": [],
                        "concerns": ["No restaurants found"],
                        "score": 0.0
                    }
                }
            
            # Get details for each place
            restaurants = []
            for place in places:
                details = self._get_place_details(place["place_id"])
                if details:
                    restaurants.append(details)
            
            # Analyze the results
            analysis = self._analyze_places(restaurants)
            
            return {
                "restaurants": restaurants,
                "strategy": {
                    "location": "current location",
                    "radius": 5000,
                    "type": "restaurant",
                    "keyword": None,
                    "open_now": True,
                    "min_rating": 4.0,
                    "max_price": None
                },
                "analysis": {
                    "matching_factors": analysis.get("matching_factors", []),
                    "concerns": analysis.get("concerns", []),
                    "score": analysis.get("score", 0.0)
                }
            }
        except Exception as e:
            logger.error(f"Error finding restaurants: {str(e)}")
            raise
    
    def _search_places(self, query: str) -> List[Dict]:
        """Search for places using the Places API."""
        params = {
            "query": query,
            "type": "restaurant",
            "key": self.api_key
        }
        
        try:
            response = requests.get(self.search_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data["status"] == "ZERO_RESULTS":
                logger.warning(f"No results found for query: {query}")
                raise ValueError(f"No restaurants found for: {query}. Try adjusting your search criteria or location.")
            elif data["status"] != "OK":
                logger.error(f"Places API error: {data['status']}")
                raise ValueError(f"Error searching for restaurants: {data['status']}")
                
            return data.get("results", [])
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error searching places: {str(e)}")
            raise ValueError("Network error while searching for restaurants. Please try again.")
        except ValueError as e:
            raise
        except Exception as e:
            logger.error(f"Error searching places: {str(e)}")
            raise ValueError("Unexpected error while searching for restaurants. Please try again.")
    
    def _get_place_details(self, place_id: str) -> Optional[Dict]:
        """Get detailed information for a specific place."""
        params = {
            "place_id": place_id,
            "fields": "name,formatted_address,formatted_phone_number,rating,user_ratings_total,price_level,opening_hours,website,url,geometry,vicinity",
            "key": self.api_key
        }
        
        try:
            response = requests.get(self.details_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data["status"] != "OK":
                logger.error(f"Place Details API error: {data['status']}")
                return None
                
            result = data.get("result", {})
            
            # Ensure all required fields are present
            if not all(key in result for key in ["name", "formatted_address", "rating", "user_ratings_total"]):
                logger.error("Missing required fields in place details")
                return None
            
            # Add place_id to the result
            result["place_id"] = place_id
            
            # If vicinity is not present, use formatted_address
            if "vicinity" not in result:
                result["vicinity"] = result.get("formatted_address", "")
            
            # If geometry is not present, create a default one
            if "geometry" not in result:
                result["geometry"] = {
                    "location": {
                        "lat": 0.0,
                        "lng": 0.0
                    }
                }
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting place details: {str(e)}")
            return None
    
    def _analyze_places(self, places: List[Dict]) -> Dict[str, Union[List[str], float]]:
        """Analyze and rank the restaurant options."""
        if not places:
            return {
                "matching_factors": [],
                "concerns": ["No restaurants to analyze"],
                "score": 0.0
            }
            
        # Create a simple analysis based on ratings and reviews
        sorted_places = sorted(
            places,
            key=lambda x: (
                x.get("rating", 0),
                x.get("user_ratings_total", 0)
            ),
            reverse=True
        )
        
        matching_factors = []
        concerns = []
        
        # Analyze each place
        for place in sorted_places:
            name = place.get("name", "Unknown")
            rating = place.get("rating", 0)
            reviews = place.get("user_ratings_total", 0)
            price_level = place.get("price_level", 1)
            
            # Add matching factors
            if rating >= 4.0:
                matching_factors.append(f"High rating ({rating}) at {name}")
            if reviews >= 100:
                matching_factors.append(f"Popular place ({reviews} reviews) at {name}")
            if price_level >= 3:
                matching_factors.append(f"Fancy place (price level {price_level}) at {name}")
            
            # Add concerns
            if rating < 3.5:
                concerns.append(f"Low rating ({rating}) at {name}")
            if reviews < 50:
                concerns.append(f"Few reviews ({reviews}) at {name}")
            if price_level < 2:
                concerns.append(f"Basic place (price level {price_level}) at {name}")
        
        # Calculate overall score
        score = 0.0
        if matching_factors:
            score = min(1.0, len(matching_factors) / 5.0)
        
        return {
            "matching_factors": matching_factors,
            "concerns": concerns,
            "score": score
        } 