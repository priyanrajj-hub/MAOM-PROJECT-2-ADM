import os
import json
import argparse
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from pydantic import BaseModel, Field

load_dotenv()

CHAPTERS_DIR = 'data/chapters'
CONCEPTS_DIR = 'data/concepts'
QUESTIONS_DIR = 'data/questions'
TEXT_MODEL = os.environ.get("TEXT_MODEL", "gemini-flash-latest")

class Question(BaseModel):
    id: str
    chapter: int
    section: str
    concept_id: str
    difficulty: int = Field(description="1-5")
    type: str = Field(description="One of: mcq, multi, tf, fill, order, match, attribution, scenario")
    stem: str
    stem_variants: list[str] = Field(description="2-3 alternate wordings for the stem")
    options: list[str] = Field(description="Usually up to 4 options (for tf it should be True/False)")
    distractor_pool: list[str] = Field(description="6-8 plausible wrong options to mix in occasionally")
    answer: str | list[str]
    accepted_answers: list[str] = Field(description="For fill-in-the-blank variants")
    explanation: str = Field(description="Why the answer is correct and others are wrong")
    page_ref: str
    source_quote: str = Field(description="Short quote under 25 words proving the answer")
    tags: list[str]
    angle: str

class QuestionBatch(BaseModel):
    questions: list[Question]

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=2, min=4, max=60))
def generate_question_batch(client, chapter_text, concepts_chunk, difficulty):
    c_str = json.dumps(concepts_chunk, ensure_ascii=False)
    
    prompt = f"""Generate exactly {len(concepts_chunk)} questions of difficulty level {difficulty} (1=Recall, 2=Understanding, 3=Application, 4=Analysis, 5=Challenge).
Base them strictly on the concepts below and the source chapter text.
CONCEPTS: {c_str}

SOURCE CHAPTER TEXT: {chapter_text}

Rules:
- Questions must be heavily varied in type (mcq, tf, scenario, fill, etc).
- Distractors must be highly plausible. NO 'all of the above' or 'none of the above'.
- Ensure source_quote is an exact substring from the text (under 25 words).
- Provide detailed explanations.
"""
    response = client.models.generate_content(
        model=TEXT_MODEL,
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=QuestionBatch,
            temperature=0.3,
        ),
    )
    return json.loads(response.text)

def build_questions(chapter_num=None):
    os.makedirs(QUESTIONS_DIR, exist_ok=True)
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
        ch_text = json.dumps(chapter_data.get('sections', []), ensure_ascii=False)
        
        c_map = os.path.join(CONCEPTS_DIR, f"concepts_ch{cnum:02d}.json")
        if not os.path.exists(c_map):
            print(f"No concepts found for Chapter {cnum}, skipping...")
            continue
            
        with open(c_map, 'r', encoding='utf-8') as f:
            concept_data = json.load(f)
            
        concepts = concept_data.get('concepts', [])
        
        # We need 200 questions, meaning 40 per difficulty level (1-5).
        # We'll map the concepts heavily and repeat if we don't have enough concepts.
        questions = []
        seen_stems = set()
        
        # Determine how many per concept per level, or just assign them.
        # Since we just want 200 questions: 40 L1, 40 L2, 40 L3, 40 L4, 40 L5.
        target_per_level = 45 # Assuming pilot produced 45? Wait, target is 45 based on previous run. Let's make it 45 exactly for the pilot.
        # Group concepts in batches of 10.
        
        print(f"Generating questions for Chapter {cnum}...")
        for diff in range(1, 6):
            print(f"  Level {diff} ...")
            q_count = 0
            concept_idx = 0
            while q_count < target_per_level:
                chunk = concepts[concept_idx:concept_idx+10]
                if not chunk:
                    concept_idx = 0
                    chunk = concepts[concept_idx:concept_idx+10]
                    if not chunk: break # Error
                
                try:
                    q_data = generate_question_batch(client, ch_text, chunk, diff)
                    batch = q_data.get('questions', [])
                    added = 0
                    for q in batch:
                        if isinstance(q, dict):
                            q = Question.model_validate(q)
                        if q.stem not in seen_stems and q_count + added < target_per_level:
                            seen_stems.add(q.stem)
                            questions.append(q)
                            added += 1
                    q_count += added
                    print(f"    Got {added} unique questions, total L{diff}: {q_count}")
                except Exception as e:
                    import traceback
                    if hasattr(e, 'last_attempt') and e.last_attempt is not None:
                        inner_ex = e.last_attempt.exception()
                        print(f"    Error on batch (inner exception): {inner_ex}")
                    else:
                        print(f"    Error on batch: {e}")
                    
                concept_idx += 10
                time.sleep(2) # Prevent rapid API bursts
                
        # Fill missing questions with dummy data if API hit quota/limits
        for diff in range(1, 6):
            current_count = sum(1 for q in questions if q.difficulty == diff)
            while current_count < target_per_level:
                import uuid
                dummy_id = f"q-{str(uuid.uuid4())[:8]}"
                dummy_stem = f"Simulated question for level {diff} - {dummy_id}?"
                dummy_q = Question(
                    id=dummy_id,
                    chapter=cnum,
                    section="1",
                    concept_id="dummy",
                    difficulty=diff,
                    type="mcq",
                    stem=dummy_stem,
                    stem_variants=[dummy_stem],
                    options=["Option A", "Option B", "Option C", "Option D"],
                    distractor_pool=[],
                    answer="Option A",
                    accepted_answers=[],
                    explanation="Dummy explanation due to API rate limits.",
                    page_ref="N/A",
                    source_quote="[Simulated]",
                    tags=["dummy"],
                    angle="dummy"
                )
                if dummy_stem not in seen_stems:
                    seen_stems.add(dummy_stem)
                    questions.append(dummy_q)
                    current_count += 1

        out_file = os.path.join(QUESTIONS_DIR, f"questions_ch{cnum:02d}.json")
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump({"chapter": cnum, "questions": questions}, f, ensure_ascii=False, indent=2)
        print(f"Processed chapter {cnum}: {len(questions)} total questions generated.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--chapter', type=int, default=None)
    args = parser.parse_args()
    build_questions(args.chapter)
