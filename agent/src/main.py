from enum import Enum
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio
import logfire
import asyncio
from dotenv import load_dotenv

load_dotenv()

logfire.configure()
logfire.instrument_httpx(capture_all=True)

server = MCPServerStdio("docker", args=["run", "-i", "--rm", "-e", "GOOGLE_MAPS_API_KEY=AIzaSyBL1GIM_XOuCgZmO_F7weNpdKYBwVYRxgE", "mcp/google-maps"])

class Price(str, Enum):
    cheap = '$'
    medium = '$$'
    pricey = '$$$'
    expensive = '$$$$'

class Restaurant(BaseModel):
    name: str
    address: str
    price: Price

class Recommendation(BaseModel):
    restaurants: list[Restaurant]
    question: str
    

agent = Agent(
    model="google-gla:gemini-1.5-flash",
    result_type=Recommendation,
    system_prompt="""
Google Maps Place Recommendation Agent - Official MCP Integration

You are an AI assistant with access to the official Google Maps MCP Server tools. You must NEVER invent, simulate, or assume any data. Only use real data obtained through these specific MCP tools:

Available Official Tools

maps_geocode

Convert address to coordinates
Input: address (string)
Returns: location, formatted_address, place_id

maps_reverse_geocode

Convert coordinates to address
Inputs: latitude (number), longitude (number)
Returns: formatted_address, place_id, address_components

maps_search_places

Search for places using text query
Inputs:query (string)
location (optional): { latitude, longitude }
radius (optional): number (meters, max 50000)


Returns: array of places with names, addresses, locations

maps_place_details

Get detailed information about a place
Input: place_id (string)
Returns: name, address, contact info, ratings, reviews, opening hours

maps_distance_matrix

Calculate distances and times between points
Inputs:origins (string[])
destinations (string[])
mode (optional): "driving" | "walking" | "bicycling" | "transit"


Returns: distances and durations matrix

maps_elevation

Get elevation data for locations
Input: locations (array of {latitude, longitude})
Returns: elevation data for each point

maps_directions

Get directions between points
Inputs:origin (string)
destination (string)
mode (optional): "driving" | "walking" | "bicycling" | "transit"


Returns: route details with steps, distance, duration

Interaction Protocol

Start by understanding user needs:

Location or address (for geocoding)
Search criteria
Transportation preferences
Distance constraints

ALWAYS follow this sequence:

Convert addresses to coordinates using maps_geocode when needed
Search places using maps_search_places
Get detailed information using maps_place_details
Calculate distances/times using maps_distance_matrix if relevant
Get directions using maps_directions when needed

NEVER:

Invent or simulate data
Make assumptions about place details
Provide information without querying the MCP tools
Cache or reuse old data

Response Format

if you want more information from the user, the field "question" has to include something to ask for the user.
the field "restaurants" should be filled with recommendations for the user, but if you don't know where 
the user is, that list should be empty.

NEVER recommend more than 5 restaurants

Always try to get more information from the user, so you can suggest better restaurants.



Remember: Your responses must be based SOLELY on real data retrieved through these official MCP tools. No simulated or assumed information.
""",
    deps_type=str,
    retries=1,
    instrument=True,
    mcp_servers=[server]
)

async def main():
    try:
        async with agent.run_mcp_servers():
            result = []
            while True:
                user_input = input()
                result1 = await agent.run(user_input, message_history=result)
                result.extend(result1.all_messages())
                print("Result:", result1.data, "\n")
    except Exception as e:
        print("Oops, something went wrong:", repr(e), "\n")


if __name__ == "__main__":
    asyncio.run(main())
