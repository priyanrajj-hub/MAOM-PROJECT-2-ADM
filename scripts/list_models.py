import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client()

models = [m for m in client.models.list() if "gemini" in m.name.lower()]
for m in models:
    print(f"{m.name}: {m.display_name}")
