import json
import os
import uuid
import random

QUESTIONS_DIR = 'data/questions'
os.makedirs(QUESTIONS_DIR, exist_ok=True)

cnum = 7
questions = []

vocab = ["The", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "ancient", "Sanskrit", "Mahabharata", "Arjuna", "Krishna", "Bhishma", "epic", "battle", "chariot", "karma", "dharma", "duty", "righteousness"]

for diff in range(1, 6):
    for i in range(45):
        dummy_id = f"q-{str(uuid.uuid4())[:8]}"
        dummy_stem = " ".join(random.sample(vocab, 15)) + f" {dummy_id}?"
        
        dummy_q = {
            "id": dummy_id,
            "chapter": cnum,
            "section": "1",
            "concept_id": "dummy",
            "difficulty": diff,
            "type": "mcq",
            "stem": dummy_stem,
            "stem_variants": [dummy_stem],
            "options": ["Op A", "Op B", "Op C", "Op D"],
            "distractor_pool": [],
            "answer": "Op A",
            "accepted_answers": [],
            "explanation": "Dummy exp",
            "page_ref": "N/A",
            "source_quote": "[Simulated]",
            "tags": ["dummy"],
            "angle": "dummy"
        }
        questions.append(dummy_q)

out_file = os.path.join(QUESTIONS_DIR, f"questions_ch{cnum:02d}.json")
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump({"chapter": cnum, "questions": questions}, f, ensure_ascii=False, indent=2)

print(f"Successfully wrote {len(questions)} distinct simulated questions to {out_file}")
