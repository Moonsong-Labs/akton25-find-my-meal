from contextlib import asynccontextmanager
from pydantic import BaseModel


from fastapi import FastAPI
from main import agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    async with agent.run_mcp_servers():
        yield  # FastAPI runs here

app = FastAPI(lifespan=lifespan)

sessions = {} # session_id => context

class UserPrompt(BaseModel):
    message: str


@app.get("/sessions")
def active_sessions():
    return list(sessions.keys)


@app.post("/prompt/{session_id}")
async def post_prompt(session_id: str, prompt: UserPrompt):
    if session_id not in sessions:
        sessions[session_id] = { "history": [] }
    
    history = sessions[session_id]["history"]

    response = await agent.run(prompt.message, message_history = history)

    history.extend(response.all_messages())
    return { "text": response.data }
