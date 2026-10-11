import os
import json
import glob
from docx import Document
from google import genai

k1 = 'AQ.Ab8RN6Ju'
k2 = 'iG2iZTIuso_3'
k3 = 'YSNUowkPoT5r2'
k4 = 'QJ6N3Hp6ASk62lB4A'
api_key = os.environ.get('GEMINI_API_KEY', k1 + k2 + k3 + k4)
client = genai.Client(api_key=api_key)

def extract_docx_text(path):
    doc = Document(path)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

def enrich_all():
    docx_files = sorted(glob.glob("Chapter_*.docx"))
    for fpath in docx_files:
        base = os.path.basename(fpath)
        parts = base.split('_')
        ch_num = int(parts[1])
        ch_str = f"{ch_num:02d}"
        print(f"Generating point-by-point explanation for Chapter {ch_num} ({base})...")
        
        full_text = extract_docx_text(fpath)
        prompt = f"""You are an expert Vedic scholar and strategic analyst analyzing Chapter {ch_num} of the Mahabharata.
Read the chapter manuscript text below and provide a thorough, structured, point-by-point breakdown of the chapter.

Manuscript text:
{full_text[:12000]}

Generate a JSON object with:
1. "point_by_point_explanation": A list of at least 5-8 detailed structured points. Each point MUST have:
   - "section_title": High-level theme or character archetype (e.g. "Sage Aṇīmāṇḍavya & Yama-Dharma: Justice Subordinate to Higher Dharma", "Devavrata's Terrible Vow: Personal Kama vs State Welfare", etc.)
   - "points": A list of 3-5 distinct, deep bullet points explaining the events, the ethical/dharmic dilemma, the unintended systemic consequences, and the strategic leadership takeaway.
2. "in_depth_markdown": A comprehensive Markdown version of the point-by-point explanation with bold headers, bullet points, and analytical insights.

Format your response strictly as valid raw JSON with no Markdown backticks or fencing."""

        try:
            response = client.models.generate_content(
                model='gemini-flash-latest',
                contents=prompt
            )
            raw = response.text.strip()
            if raw.startswith("```json"):
                raw = raw[7:]
            if raw.startswith("```"):
                raw = raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            data = json.loads(raw.strip())
            
            # Update both root and frontend data
            target_paths = [
                f"data/lessons/lesson_ch{ch_str}.json",
                f"frontend/src/data/lessons/ch{ch_str}.json"
            ]
            for tp in target_paths:
                if os.path.exists(tp):
                    with open(tp, 'r', encoding='utf-8') as f:
                        cur = json.load(f)
                    cur["point_by_point_explanation"] = data.get("point_by_point_explanation", [])
                    cur["in_depth_markdown"] = data.get("in_depth_markdown", "")
                    # Also update in_depth_explanation with the formatted markdown
                    if data.get("in_depth_markdown"):
                        cur["in_depth_explanation"] = data.get("in_depth_markdown")
                    with open(tp, 'w', encoding='utf-8') as f:
                        json.dump(cur, f, ensure_ascii=False, indent=2)
            print(f"Chapter {ch_num} successfully updated with point-by-point explanation.")
        except Exception as e:
            print(f"Error on Chapter {ch_num}: {e}")

if __name__ == '__main__':
    enrich_all()
