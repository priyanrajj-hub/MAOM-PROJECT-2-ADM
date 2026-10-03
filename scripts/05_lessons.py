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
LESSONS_DIR = 'data/lessons'

TEXT_MODEL = os.environ.get("TEXT_MODEL", "gemini-flash-latest")
VERIFIER_MODEL = os.environ.get("VERIFIER_MODEL", "gemini-2.5-pro")

# Define JSON schemas
class TermDef(BaseModel):
    term: str
    meaning: str

class CharacterDef(BaseModel):
    character: str
    description: str

class CaseStudy(BaseModel):
    story: str
    lesson: str

class SlokaDef(BaseModel):
    sloka: str
    meaning: str

class SectionLesson(BaseModel):
    title: str
    prose: str
    key_terms: list[TermDef] = Field(description="List of terms and meanings")
    characters: list[CharacterDef] = Field(description="Characters mentioned and what they represent")
    case_studies: list[CaseStudy] = Field(description="Stories/examples from the text and their lessons")
    common_misconceptions: list[str]
    remember_this: str

class ChapterLesson(BaseModel):
    learning_objectives: list[str]
    sections: list[SectionLesson]
    glossary: list[TermDef]
    timeline_or_character_map: str = Field(description="Summary of timeline or characters")
    slokas: list[SlokaDef] = Field(description="Important slokas with transliteration and meaning")
    cheat_sheet: str = Field(description="One-page cheat sheet summary")

class FaithfulnessCheck(BaseModel):
    is_faithful: bool
    unsupported_claims: list[str] = Field(description="List of claims that are not supported by the source text, empty if faithful")

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def generate_lesson(client, chapter_data):
    chapter_text = json.dumps(chapter_data.get('sections', []), ensure_ascii=False)
    title = chapter_data.get('title', 'Unknown Title')
    
    prompt = f"""You are an instructional designer creating a lesson for Chapter: {title}.
Here is the chapter text extracted from the book:
{chapter_text}

Generate a comprehensive lesson based ONLY on this text. Do not invent facts or bring in outside knowledge.
Follow the JSON schema exactly.
"""
    try:
        response = client.models.generate_content(
            model=TEXT_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ChapterLesson,
                temperature=0.2,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        import traceback
        with open("real_error.txt", "w") as f:
            f.write(traceback.format_exc())
        raise

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def run_faithfulness_check(client, source_text, lesson_data):
    lesson_text = json.dumps(lesson_data, ensure_ascii=False)
    
    prompt = f"""You are a strict verification assistant. Compare the generated lesson against the original source chapter.
Are there any claims, quotes, or characterizations in the LESSON that are NOT supported by the SOURCE?

SOURCE CHAPTER:
{source_text}

LESSON:
{lesson_text}

Return JSON with is_faithful=true if everything is supported, otherwise false and list the unsupported claims.
"""
    response = client.models.generate_content(
        model=VERIFIER_MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=FaithfulnessCheck,
            temperature=0.0,
        ),
    )
    return json.loads(response.text)

def build_lessons(chapter_num=None):
    os.makedirs(LESSONS_DIR, exist_ok=True)
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
            
        print(f"Generating lesson for Chapter {chapter_data.get('number', '?')}...")
        max_attempts = 3
        
        for attempt in range(max_attempts):
            print(f"  Attempt {attempt + 1}")
            lesson_data = generate_lesson(client, chapter_data)
            
            # Faithfulness check
            source_text = json.dumps(chapter_data.get('sections', []), ensure_ascii=False)
            print("  Running faithfulness check...")
            check = run_faithfulness_check(client, source_text, lesson_data)
            
            if check.get('is_faithful', False) or not check.get('unsupported_claims'):
                print("  Faithfulness check passed!")
                break
            else:
                print(f"  Faithfulness failed. Unsupported claims: {check.get('unsupported_claims')}")
                if attempt == max_attempts - 1:
                    print("  Max attempts reached, saving as is...")
                    
        out_file = os.path.join(LESSONS_DIR, f"lesson_ch{chapter_data.get('number'):02d}.json")
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(lesson_data, f, ensure_ascii=False, indent=2)
            
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--chapter', type=int, default=None)
    parser.add_argument('--allow-partial', action='store_true') # Intentionally added for compatibility in batch runs
    args = parser.parse_args()
    build_lessons(args.chapter)
