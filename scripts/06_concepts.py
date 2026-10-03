import os
import json
import argparse
from dotenv import load_dotenv
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from pydantic import BaseModel, Field

load_dotenv()

CHAPTERS_DIR = 'data/chapters'
CONCEPTS_DIR = 'data/concepts'
TEXT_MODEL = os.environ.get("TEXT_MODEL", "gemini-flash-latest")

class Concept(BaseModel):
    concept_id: str = Field(description="Unique ID, e.g., ch07-c001")
    title: str = Field(description="Short title or keyword of the concept")
    description: str = Field(description="Detailed description of the fact, term, event, or lesson")
    section: str = Field(description="Section heading or number")
    page_ref: str = Field(description="The printed page number reference (e.g. p. 84)")

class ConceptBank(BaseModel):
    concepts: list[Concept]

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def extract_concepts(client, chapter_data, chapter_num):
    chapter_text = json.dumps(chapter_data.get('sections', []), ensure_ascii=False)
    title = chapter_data.get('title', 'Unknown Title')
    
    prompt = f"""Extract an exhaustive atomic concept list (80-150 concepts) for Chapter {chapter_num}: {title}.
The text is below. Include facts, terms, characters, events, slokas, arguments, lessons, cause-effect links, comparisons, etc.
Assign a unique concept_id (format: ch{chapter_num:02d}-c001, ch{chapter_num:02d}-c002, etc.) for each.

TEXT:
{chapter_text}
"""
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ConceptBank,
            temperature=0.2,
        ),
    )
    return json.loads(response.text)

def build_concepts(chapter_num=None):
    os.makedirs(CONCEPTS_DIR, exist_ok=True)
    client = genai.Client()
    
    ch_files = []
    if chapter_num:
        ch_files = [os.path.join(CHAPTERS_DIR, f"ch{chapter_num:02d}.json")]
    else:
        ch_files = [os.path.join(CHAPTERS_DIR, f) for f in os.listdir(CHAPTERS_DIR) if f.endswith('.json')]
        
    for ch_file in ch_files:
        if not os.path.exists(ch_file): continue
        with open(ch_file, 'r', encoding='utf-8') as f:
            chapter_data = json.load(f)
            
        cnum = chapter_data.get('number', 0)
        print(f"Extracting concepts for Chapter {cnum}...")
        
        try:
            concept_data = extract_concepts(client, chapter_data, cnum)
            concepts = concept_data.get('concepts', [])
            print(f"  Extracted {len(concepts)} concepts for Chapter {cnum}")
            
            out_file = os.path.join(CONCEPTS_DIR, f"concepts_ch{cnum:02d}.json")
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(concept_data, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print(f"  Error extracting concepts for Chapter {cnum}: {e}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--chapter', type=int, default=None)
    args = parser.parse_args()
    build_concepts(args.chapter)
