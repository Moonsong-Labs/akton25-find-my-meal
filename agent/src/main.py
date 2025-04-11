from enum import Enum
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio
import logfire
import asyncio
from dotenv import load_dotenv

from information_agent import agent
from recommender_agent import agent2

load_dotenv()

logfire.configure()
logfire.instrument_httpx(capture_all=True)

async def main():
    try:
        #agent2.run_mcp_servers();
        async with agent2.run_mcp_servers():
            result = []
            while True:
                user_input = input()
                result1 = await agent2.run(user_input, message_history=result)
                result.extend(result1.all_messages())
                print("Result:", result1.data, "\n")
    except Exception as e:
        print("Oops, something went wrong:", repr(e), "\n")


if __name__ == "__main__":
    asyncio.run(main())
