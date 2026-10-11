import os
import glob
import json
import docx
from google import genai

API_KEY = os.environ.get("GEMINI_API_KEY", "")
client = genai.Client(api_key=API_KEY) if API_KEY else genai.Client()

def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

def generate_for_chapter(chapter_num, doc_text):
    prompt = f"""
    You are an expert on the Mahabharata. Evaluate the following chapter text (Chapter {chapter_num}).
    Return a strictly valid JSON object with the following structure:
    {{
        "chapter_content": {{
            "summary": "A comprehensive summary of the chapter.",
            "in_depth_explanation": "An in-depth, profound explanation of the chapter's underlying philosophies, strategic implications, and dharma dilemmas.",
            "mindmap_mermaid": "graph TD\\n  A[Core Dilemma] --> B[Decision]\\n  B --> C[Outcome]",
            "new_highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
        }},
        "extra_questions": [
            {{
                "id": "q-ch{chapter_num}-1",
                "chapter": {chapter_num},
                "section": "1",
                "concept_id": "general",
                "difficulty": 1,
                "type": "mcq",
                "stem": "Question text here?",
                "stem_variants": ["Question text here?"],
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "distractor_pool": [],
                "answer": "Option A",
                "accepted_answers": [],
                "explanation": "Explanation here",
                "page_ref": "NA",
                "source_quote": "",
                "tags": [],
                "angle": ""
            }}
        ]
    }}
    Include at least 5 new varied multiple-choice questions in extra_questions with difficulties from 1 to 5.
    IMPORTANT: Provide ONLY the raw JSON output. Do NOT wrap in markdown block quotes.
    
    TEXT:
    {doc_text[:20000]}
    """
    
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents=prompt
    )
    
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())

def main():
    docx_files = glob.glob("manuscripts/Chapter_*.docx") or glob.glob("Chapter_*.docx")
    for doc in sorted(docx_files):
        try:
            chap_num_str = doc.split("_")[1]
            chapter_num = int(chap_num_str)
        except:
            continue
        
        print(f"Processing Chapter {chapter_num} from {doc}...")
        text = extract_text_from_docx(doc)
        if not text:
            print("No text found.")
            continue
            
        try:
            data = generate_for_chapter(chapter_num, text)
        except Exception as e:
            print(f"API Error on chapter {chapter_num}: {e}")
            continue
            
        # Update lessons JSON
        lesson_file = f"data/lessons/lesson_ch{chapter_num:02d}.json"
        
        if os.path.exists(lesson_file):
            with open(lesson_file, 'r', encoding='utf-8') as f:
                lesson_data = json.load(f)
        else:
            lesson_data = {"chapter": chapter_num, "theme": f"Chapter {chapter_num}", "abstract": "", "objectives": [], "content_blocks": [], "glossary": []}
            
        # Append our new fields
        ch_content = data.get('chapter_content', {})
        lesson_data['summary'] = ch_content.get('summary', '')
        lesson_data['in_depth_explanation'] = ch_content.get('in_depth_explanation', '')
        lesson_data['mindmap_chart'] = ch_content.get('mindmap_mermaid', '')
        lesson_data['highlights'] = ch_content.get('new_highlights', [])
        
        with open(lesson_file, 'w', encoding='utf-8') as f:
            json.dump(lesson_data, f, ensure_ascii=False, indent=2)
            
        # Update questions JSON
        q_file = f"data/questions/questions_ch{chapter_num:02d}.json"
        if os.path.exists(q_file):
            with open(q_file, 'r', encoding='utf-8') as f:
                q_data = json.load(f)
        else:
            q_data = {"chapter": chapter_num, "questions": []}
            
        new_qs = data.get('extra_questions', [])
        q_data['questions'].extend(new_qs)
        
        with open(q_file, 'w', encoding='utf-8') as f:
            json.dump(q_data, f, ensure_ascii=False, indent=2)
            
        print(f"Chapter {chapter_num} processed successfully. Added {len(new_qs)} new questions.")

if __name__ == '__main__':
    main()
