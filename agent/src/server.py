from contextlib import asynccontextmanager
from pydantic import BaseModel
from pydantic_ai.usage import UsageLimits


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from information_agent import agent
from recommender_agent import agent2


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    async with agent2.run_mcp_servers():
        yield  # FastAPI runs here


app = FastAPI(lifespan=lifespan)

# Define allowed origins
origins = [
    "http://localhost:3000",  # Default Next.js dev server
    "http://127.0.0.1:3000",  # Another common localhost variant
    # Add your deployed frontend URL here if applicable
    # e.g., "https://your-frontend-domain.com"
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all standard methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

sessions = {}  # session_id => context


class UserPrompt(BaseModel):
    message: str


@app.get("/sessions")
def active_sessions():
    return list(sessions.keys())


@app.post("/prompt/{session_id}")
async def post_prompt(session_id: str, prompt: UserPrompt):
    if session_id not in sessions:
        sessions[session_id] = {"history": []}

    history = sessions[session_id]["history"]

    response = await agent.run(prompt.message, message_history=history)

    history.extend(response.all_messages())
    return response.data


@app.post("/prompt_response/{session_id}")
async def post_prompt_response(session_id: str):
    if session_id not in sessions:
        return []

    history = sessions[session_id]["history"]

    response = await agent2.run(None, message_history=history)

    history.extend(response.all_messages())
    return response.data
