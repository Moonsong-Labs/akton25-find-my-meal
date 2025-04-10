from contextlib import asynccontextmanager
from pydantic import BaseModel
from pydantic_ai.usage import UsageLimits


from fastapi import FastAPI
from information_agent import agent
from recommender_agent import agent2


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    async with agent2.run_mcp_servers():
        yield  # FastAPI runs here

app = FastAPI(lifespan=lifespan)

sessions = {} # session_id => context

class UserPrompt(BaseModel):
    message: str


@app.get("/sessions")
def active_sessions():
    return list(sessions.keys())


@app.post("/prompt/{session_id}")
async def post_prompt(session_id: str, prompt: UserPrompt):
    if session_id not in sessions:
        sessions[session_id] = { "history": [] }
    
    history = sessions[session_id]["history"]

    response = await agent.run(prompt.message, message_history = history)

    history.extend(response.all_messages())
    return response.data

@app.post("/prompt_response/{session_id}")
async def post_prompt_response(session_id: str, prompt: UserPrompt):
    if session_id not in sessions:
        return []
    
    history = sessions[session_id]["history"]

    limits = UsageLimits(
        request_limit=50,        
        request_tokens_limit=None,   
        response_tokens_limit=None,
        total_tokens_limit=None     
    )

    response = await agent2.run(prompt.message, message_history = history, usage_limits= limits )

    history.extend(response.all_messages())
    return response.data