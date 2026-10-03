import os
import json
import base64
import argparse
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from pydantic import BaseModel, Field

load_dotenv()

TRANSCRIPTS_DIR = 'data/raw/transcripts'
RAW_PAGES_DIR = 'data/raw/pages'
CACHE_JSON = 'data/cache/transcribe_cache.json'
# We default to gemini-2.5-flash as the best value multimodal model
VISION_MODEL = os.environ.get("VISION_MODEL", "gemini-2.5-pro")

# Define JSON schema for structured output using Pydantic
class Block(BaseModel):
    type: str = Field(description="One of: heading, paragraph, sloka_devanagari, sloka_iast, translation, footnote, list, caption")
    text: str

class TranscriptionSchema(BaseModel):
    pdf_page: int
    printed_page: int | None
    header: str | None
    blocks: list[Block]
    highlighted_phrases: list[str] = Field(default_factory=list)
    confidence: float
    uncertain_spans: list[str] = Field(default_factory=list)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def estimate_cost(num_pages):
    print(f"ESTIMATED COST for {num_pages} pages: Gemini Flash has substantial free tiers. If paid, it's roughly $0.075 / 1M input tokens.")
    print("WARNING: Depending on your tier, you might hit RPM (Requests Per Minute) limits. Be prepared for retries.")

# Configure Tenacity for exponential backoff (rate limits)
@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def call_gemini(client, num_str, base64_image):
    prompt = """You are a specialized transcription assistant for a historical and spiritual text ("Strategic Lessons from Mahābhārata"). 
Transcribe the provided page verbatim. Do not summarize or correct typos unless absolutely necessary.
- Preserve all IAST diacritics exactly (e.g., ā ī ū ṛ ṃ ḥ ś ṣ ṇ ñ ṭ ḍ). 
- Keep Devanagari ślokas as Devanagari, and keep the English/IAST transliteration line separate.
- Mark footnote numbers as [^n] within the text, and extract the footnote text as its own block.
- Mark headings clearly. 
- Drop the running headers and page-number chrome from the main text body, BUT capture the "printed page number" and "running-header text" as separate fields.
- Treat any visible highlighted artifacts or contextual boxed/emphasized text as highlighted_phrases.
PDF Page number is """ + num_str

    img_bytes = base64.b64decode(base64_image)
    response = client.models.generate_content(
        model=VISION_MODEL,
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
            prompt
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TranscriptionSchema,
            temperature=0.0,
        ),
    )
    return response.text

def transcribe_pages(start_page=1, end_page=183):
    os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(CACHE_JSON), exist_ok=True)
    
    cache = set()
    if os.path.exists(CACHE_JSON):
        with open(CACHE_JSON, 'r') as f:
            cache = set(json.load(f))
            
    client = genai.Client() # Picks up GEMINI_API_KEY from environment 

    pages_to_process = []
    for i in range(start_page, end_page + 1):
        num_str = f"{i:03d}"
        if num_str not in cache:
            img_path = os.path.join(RAW_PAGES_DIR, f"page_{num_str}_masked.png")
            if os.path.exists(img_path):
                pages_to_process.append(num_str)
                
    if not pages_to_process:
        print("All requested pages are already transcribed in cache.")
        return
        
    estimate_cost(len(pages_to_process))
    
    # Very simple RPM management
    RPM_LIMIT = int(os.environ.get("RPM", 15))
    request_interval = 60.0 / RPM_LIMIT
    
    for num_str in pages_to_process:
        print(f"Transcribing PDF page {num_str}...")
        masked_path = os.path.join(RAW_PAGES_DIR, f"page_{num_str}_masked.png")
        base64_image = encode_image(masked_path)
        
        start_time = time.time()
        
        try:
            raw_text = call_gemini(client, num_str, base64_image)
            data = json.loads(raw_text)
            
            out_file = os.path.join(TRANSCRIPTS_DIR, f"page_{num_str}.json")
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                
            cache.add(num_str)
            with open(CACHE_JSON, 'w') as f:
                json.dump(list(cache), f)
                
        except Exception as e:
            print(f"Error transcribing page {num_str} after retries: {e}")
            break
            
        elapsed = time.time() - start_time
        if elapsed < request_interval:
            time.sleep(request_interval - elapsed)

    print("Transcription complete.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=1)
    parser.add_argument('--end', type=int, default=183)
    args = parser.parse_args()
    
    transcribe_pages(args.start, args.end)
