#!/usr/bin/env python3
"""
Main entry point for the Google Maps MCP Agent application.
Handles initialization, configuration loading, and agent orchestration.
"""

import os
import json
import logging
from dotenv import load_dotenv
from google_maps_agent.agent import GoogleMapsAgent

def setup_logging(config):
    """Configure logging based on settings from config.json"""
    logging.basicConfig(
        level=getattr(logging, config['logging']['level']),
        format=config['logging']['format']
    )
    return logging.getLogger(__name__)

def load_config():
    """Load configuration from config.json"""
    try:
        with open('config.json', 'r') as f:
            config = json.load(f)
        return config
    except FileNotFoundError:
        logging.error("config.json not found")
        raise
    except json.JSONDecodeError:
        logging.error("Invalid JSON in config.json")
        raise

def main():
    """Main entry point for the application"""
    try:
        # Load environment variables
        load_dotenv()
        
        # Load configuration
        config = load_config()
        
        # Setup logging
        logger = setup_logging(config)
        logger.info("Starting Google Maps MCP Agent")
        
        # Initialize the agent
        agent = GoogleMapsAgent(config)
        
        # TODO: Add your agent orchestration logic here
        
    except Exception as e:
        logging.error(f"Application error: {str(e)}")
        raise

if __name__ == "__main__":
    main() 