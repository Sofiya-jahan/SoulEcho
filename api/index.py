import os
import sys

# Add the project root to the sys.path so we can import nlp_engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nlp_engine.main import app

# This is the entry point for Vercel Serverless Functions
# Vercel will look for 'app' or 'handler' by default.
