#!/usr/bin/env python3
"""
Test script for Restaurant Finder Agent.
"""

import json
import logging
from dotenv import load_dotenv
from google_maps_agent.agent import RestaurantFinderAgent

def main():
    # Load environment variables
    load_dotenv()
    
    # Load configuration
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)
    
    try:
        # Initialize the agent
        agent = RestaurantFinderAgent(config)
        
        # Example user query
        user_query = {
            "location": {
                "address": "Mendoza and Av. Cramer, Belgrano, Buenos Aires",
                "max_distance_blocks": 20
            },
            "preferences": {
                "cuisine": "Japanese",
                "price_range": "any",
                "requirements": [
                    "current_menu",
                    "recent_reviews",
                    "operating_hours"
                ]
            },
            "constraints": {
                "transport": "walking",
                "time_of_day": "evening"
            }
        }
        
        logger.info("Starting restaurant search with agent...")
        result = agent.find_restaurants(user_query)
        
        print("\n=== Search Strategy ===\n")
        print(json.dumps(result["search_strategy"], indent=2))
        
        print("\n=== Restaurant Results ===\n")
        for place in result["results"]:
            print(f"\nName: {place.get('name', 'N/A')}")
            print(f"Address: {place.get('formatted_address', 'N/A')}")
            print(f"Rating: {place.get('rating', 'N/A')}")
            print(f"Price Level: {place.get('price_level', 'N/A')}")
            if 'opening_hours' in place:
                print("Opening Hours:", place['opening_hours'].get('weekday_text', ['N/A']))
            if 'formatted_phone_number' in place:
                print(f"Phone: {place['formatted_phone_number']}")
            if 'website' in place:
                print(f"Website: {place['website']}")
            print("-" * 50)
        
        print("\n=== Analysis ===\n")
        print("Top Recommended Restaurants:")
        for place_id in result["analysis"]["recommended_order"][:5]:  # Show top 5
            # Find the place analysis
            place_analysis = next(
                (p for p in result["analysis"]["analyzed_places"] if p["place_id"] == place_id),
                None
            )
            if place_analysis:
                print(f"\n{place_analysis['name']}")
                print(f"Matching Score: {place_analysis['matching_score']}")
                print("Matching Factors:", ", ".join(place_analysis['matching_factors']))
                if place_analysis['concerns']:
                    print("Concerns:", ", ".join(place_analysis['concerns']))
                print(f"Distance: {place_analysis.get('distance_estimate', 'N/A')}")
                print("-" * 30)
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")
        raise

if __name__ == "__main__":
    main() 