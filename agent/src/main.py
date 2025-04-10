from datetime import datetime

from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider


my_provider = OpenAIProvider(
    base_url='https://api.kluster.ai/v1',
    api_key='dc65de43-622f-4a1e-a4a8-4d2f2e84298a',
)

my_model = OpenAIModel(
        model_name='meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
        provider=my_provider,
    )

example_agent = Agent(
    model=my_model,
    tools=[],
)

result_sync = example_agent.run_sync('What is the capital of Italy?')
print(result_sync.data)
