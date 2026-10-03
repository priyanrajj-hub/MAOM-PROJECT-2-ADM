import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client()

for m in ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash", "gemini-flash-latest"]:
    print(f"\n--- Testing {m} ---")
    try:
        r = client.models.generate_content(model=m, contents="hello")
        print(f"Success! {r.text[:20]}")
    except Exception as e:
        if hasattr(e, '__dict__'): print(e.__dict__)
        else: print(e)
