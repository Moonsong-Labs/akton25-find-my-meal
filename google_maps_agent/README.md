# Google Maps Agent

A Python package for finding restaurants using the Google Maps API.

## Features

- Search for restaurants based on location and cuisine
- Get detailed restaurant information
- Analyze and rank restaurant options

## Installation

```bash
poetry add google_maps_agent
```

## Usage

```python
from google_maps_agent import RestaurantFinderAgent

agent = RestaurantFinderAgent()
results = agent.find_restaurants("Japanese food near Mendoza and Av. Cramer, Belgrano")
```

## Development

This package uses modern Python packaging with `pyproject.toml`. To develop:

1. Clone the repository
2. Create a virtual environment
3. Install in development mode: `pip install -e .` 