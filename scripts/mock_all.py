import json
import os
import random
import uuid

os.makedirs('data/chapters', exist_ok=True)
os.makedirs('data/lessons', exist_ok=True)
os.makedirs('data/questions', exist_ok=True)

chapters_data = []

# Sanskrit terms for flair
sanskrit_terms = ["Dharma", "Karma", "Moksha", "Yoga", "Brahman", "Atman", "Samsara", "Ahankara", "Bhakti", "Jnana", "Vairagya", "Prakriti", "Purusha"]
themes = [
    "Introduction to the Epic", "The Royal Assembly", "The Dice Game", 
    "Exile in the Forest", "Preparations for War", "The Bhagavad Gita Begins",
    "Dharma in Crisis", "The Cosmic Vision", "The Fall of Bhishma",
    "Drona's Tactics", "Karna's Vow", "The Night Massacre", 
    "Aftermath and Grief", "The Final Journey", "Ascension to Heaven"
]

for i in range(1, 16):
    theme = themes[i-1]
    
    # 1. Chapters.json element
    chapters_data.append({
        "chapter": i,
        "theme": theme,
        "abstract": f"A deep philosophical exploration of {theme}, examining the ethical and spiritual challenges faced by the characters."
    })
    
    # 2. Lesson JSON
    lesson = {
        "chapter": i,
        "theme": theme,
        "abstract": f"This chapter dives deeply into the complexities of {theme}, providing crucial context for the epic's narrative.",
        "objectives": [
            f"Understand the core principle behind {random.choice(sanskrit_terms)}.",
            f"Analyze the character motivations impacting the events of {theme}.",
            f"Apply the philosophical teachings to real-world ethical dilemmas."
        ],
        "content_blocks": [
            {
                "type": "paragraph",
                "content": f"The narrative of Chapter {i} centers around the profound concept of {random.choice(sanskrit_terms)}. As the epic unfolds, characters are forced to make decisions that balance their personal desires with universal duties."
            },
            {
                "type": "sloka_translation",
                "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
                "english_translation": "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
                "content": "This foundational verse reminds us that action itself is our responsibility, not the outcome."
            },
            {
                "type": "key_concept",
                "content": f"Focusing on the alignment of {random.choice(sanskrit_terms)} reveals the deeper spiritual undertone of horizontal actions."
            },
            {
                "type": "paragraph",
                "content": f"Ultimately, the events described in '{theme}' serve as a metaphorical battlefield for the human soul, urging the reader toward self-realization."
            }
        ],
        "glossary": [
            {
                "term": random.choice(sanskrit_terms),
                "definition": "A fundamental philosophical concept in Vedic literature.",
                "context": f"Used prominently during the discussions in {theme}."
            },
            {
                "term": random.choice(sanskrit_terms),
                "definition": "Action, work, or deed; also refers to the spiritual principle of cause and effect.",
                "context": "The driving force behind character choices."
            }
        ]
    }
    with open(f'data/lessons/lesson_ch{i:02d}.json', 'w', encoding='utf-8') as f:
         json.dump(lesson, f, ensure_ascii=False, indent=2)
         
    # 3. Questions JSON (15 questions per chapter for demo instead of 225 to save space)
    questions = []
    vocab = ["The", "quick", "battle", "epic", "moral", "dilemma", "Kurukshetra", "chariot", "duty", "righteousness", "warrior", "Krishna", "Arjuna"]
    for diff in range(1, 6):
        for j in range(3):
            dummy_id = f"q-{i}-{diff}-{j}-{str(uuid.uuid4())[:4]}"
            stem = f"In the context of {theme}, how does {random.choice(sanskrit_terms)} manifest?"
            questions.append({
                "id": dummy_id,
                "chapter": i,
                "section": "1",
                "concept_id": "concept_1",
                "difficulty": diff,
                "type": "mcq",
                "stem": stem,
                "options": ["Op A (Correct)", "Op B", "Op C", "Op D"],
                "answer": "Op A (Correct)",
                "explanation": f"In Chapter {i}, it is explicitly detailed that option A represents the correct interpretation of the text."
            })
    
    with open(f'data/questions/questions_ch{i:02d}.json', 'w', encoding='utf-8') as f:
         json.dump({"chapter": i, "questions": questions}, f, ensure_ascii=False, indent=2)

with open('data/chapters/chapters.json', 'w', encoding='utf-8') as f:
    json.dump({"chapters": chapters_data}, f, ensure_ascii=False, indent=2)

print("Successfully generated all 15 chapters of mock data!")
