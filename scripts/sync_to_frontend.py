import os
import json
import glob

def sync():
    # 1. Sync Lessons
    for i in range(1, 16):
        ch_str = f"{i:02d}"
        src_lesson = f"data/lessons/lesson_ch{ch_str}.json"
        dest_lesson = f"frontend/src/data/lessons/ch{ch_str}.json"
        
        if os.path.exists(src_lesson) and os.path.exists(dest_lesson):
            with open(src_lesson, 'r', encoding='utf-8') as f:
                src_data = json.load(f)
            with open(dest_lesson, 'r', encoding='utf-8') as f:
                dest_data = json.load(f)
                
            # Merge fields
            for key in ['summary', 'in_depth_explanation', 'mindmap_chart', 'highlights']:
                if key in src_data and src_data[key]:
                    dest_data[key] = src_data[key]
                    
            with open(dest_lesson, 'w', encoding='utf-8') as f:
                json.dump(dest_data, f, ensure_ascii=False, indent=2)
            print(f"Synced lesson ch{ch_str}")

        # 2. Sync Questions
        src_q = f"data/questions/questions_ch{ch_str}.json"
        dest_q = f"frontend/src/data/questions/ch{ch_str}.json"
        
        if os.path.exists(src_q) and os.path.exists(dest_q):
            with open(src_q, 'r', encoding='utf-8') as f:
                src_data = json.load(f)
            with open(dest_q, 'r', encoding='utf-8') as f:
                dest_data = json.load(f)
                
            # Append new questions that are not already present
            existing_ids = {q.get('id') for q in dest_data.get('questions', [])}
            new_questions = [q for q in src_data.get('questions', []) if q.get('id') not in existing_ids]
            
            dest_data['questions'] = dest_data.get('questions', []) + new_questions
            
            with open(dest_q, 'w', encoding='utf-8') as f:
                json.dump(dest_data, f, ensure_ascii=False, indent=2)
            print(f"Synced {len(new_questions)} new questions to ch{ch_str}")

if __name__ == '__main__':
    sync()
