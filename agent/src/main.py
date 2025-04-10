import random
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from pydantic_ai.settings import ModelSettings
import logfire
import asyncio
from dotenv import load_dotenv

load_dotenv()

logfire.configure()
logfire.instrument_httpx(capture_all=True)

agent = Agent(
    model="google-gla:gemini-1.5-flash",
    system_prompt="""
You're a dice game, you should roll the die and see if the number
you get back matches the user's guess. If so, tell them they're a winner.
If not, tell them they're a loser.
Use the player's name in the response.
""",
    deps_type=str,
    retries=1,
    instrument=True,
)


@agent.tool_plain
def roll_die() -> str:
    """Roll a six-sided die and return the result."""
    return str(random.randint(1, 6))


@agent.tool
def get_player_name(ctx: RunContext[str]) -> str:
    """Get the player's name."""
    return ctx.deps


async def main():
    try:
        result = await agent.run("My guess is 4", deps="Agustin")
        print("Result:", result.data, "\n")
    except Exception as e:
        print("Oops, something went wrong:", repr(e), "\n")


if __name__ == "__main__":
    asyncio.run(main())
