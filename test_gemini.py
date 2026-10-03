import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
import json

load_dotenv()

class TestSchema(BaseModel):
    result: str

client = genai.Client()
try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello",
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TestSchema,
        )
    )
    print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
