#!/usr/bin/env python3
"""
audit_data.py — Validates all 15 chapter lesson/question JSON files
Usage: python scripts/audit_data.py
Exits with code 1 if any critical issue found.
"""
import json
import os
import sys
from collections import Counter

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data')
LESSON_DIR = os.path.join(DATA_DIR, 'lessons')
QUESTION_DIR = os.path.join(DATA_DIR, 'questions')

REQUIRED_LESSON_FIELDS = ['chapter', 'theme', 'abstract', 'objectives', 'highlights', 'characters', 'content_blocks', 'glossary']
REQUIRED_Q_FIELDS = ['id', 'chapter', 'difficulty', 'stem', 'options', 'answer', 'explanation']

errors = []
warnings = []
all_ids = set()
summary_rows = []

def err(msg): errors.append(msg); print(f'  ❌ {msg}')
def warn(msg): warnings.append(msg); print(f'  ⚠️  {msg}')
def ok(msg): print(f'  ✅ {msg}')

MOCK_STEMS = ['how does karma', 'how does dharma', 'how does moksha', 'how does yoga', 'how does bhakti']
MOCK_ANSWER = ['it inspires detachment', 'it demands selfless action', 'it guides the soul', 'it transforms personal grief', 'it reveals that ego']

for ch in range(1, 16):
    print(f'\n── Chapter {ch} ──')

    # --- Lesson check ---
    lpath = os.path.join(LESSON_DIR, f'ch{ch:02d}.json')
    lesson_ok = True
    if not os.path.exists(lpath):
        err(f'Lesson file missing: {lpath}'); lesson_ok = False
    else:
        with open(lpath, encoding='utf-8') as f:
            lesson = json.load(f)
        for field in REQUIRED_LESSON_FIELDS:
            if field not in lesson:
                err(f'Lesson ch{ch:02d} missing field: {field}'); lesson_ok = False
        if lesson_ok:
            ok(f'Lesson schema OK — theme: {lesson.get("theme")}')

    # --- Questions check ---
    qpath = os.path.join(QUESTION_DIR, f'ch{ch:02d}.json')
    q_ok = True; real_count = 0; mock_count = 0
    if not os.path.exists(qpath):
        err(f'Question file missing: {qpath}'); q_ok = False
    else:
        with open(qpath, encoding='utf-8') as f:
            qdata = json.load(f)
        questions = qdata.get('questions', [])
        q_cnt = len(questions)

        diff_counts = Counter()
        correct_positions = []

        for q in questions:
            qid = q.get('id', '')
            if qid in all_ids:
                err(f'Duplicate question ID: {qid}')
            all_ids.add(qid)

            for field in REQUIRED_Q_FIELDS:
                if field not in q:
                    err(f'Question {qid} missing field: {field}'); q_ok = False

            stem = q.get('stem', '').lower()
            answer = q.get('answer', '').lower()
            options = q.get('options', [])

            # Check answer is in options
            if answer and options:
                if answer not in [o.lower() for o in options]:
                    err(f'Question {qid}: answer not found in options')
                else:
                    pos = [o.lower() for o in options].index(answer)
                    correct_positions.append(pos)

            # Detect mock content
            is_mock = any(ms in stem for ms in MOCK_STEMS) or any(ma in answer for ma in MOCK_ANSWER)
            if is_mock: mock_count += 1
            else: real_count += 1

            d = q.get('difficulty', 0)
            if d < 1 or d > 5:
                err(f'Question {qid}: invalid difficulty {d}')
            diff_counts[d] += 1

            if not q.get('stem', '').strip():
                err(f'Question {qid}: empty stem')
            if not q.get('explanation', '').strip():
                warn(f'Question {qid}: empty explanation')

        # Difficulty distribution
        for d in range(1, 6):
            cnt = diff_counts.get(d, 0)
            if cnt < 3:
                warn(f'Ch{ch:02d}: only {cnt} questions at difficulty {d} (target ≥ 3)')

        # Position bias check
        if correct_positions:
            pos_dist = Counter(correct_positions)
            for pos, cnt in pos_dist.items():
                if cnt / len(correct_positions) > 0.4:
                    warn(f'Ch{ch:02d}: correct answer position {pos} is biased ({cnt}/{len(correct_positions)} = {cnt/len(correct_positions)*100:.0f}%)')

        status = 'MOCK' if mock_count > real_count * 0.5 else 'REAL'
        if status == 'REAL' and ch != 7:
            err(f'Ch{ch:02d} claims to be REAL but is known to be mock or incomplete!')
        ok(f'Questions: {q_cnt} total, difficulty dist: {dict(diff_counts)}, content: {status} ({mock_count} mock/{real_count} real)')
        summary_rows.append((ch, lesson.get('theme','?') if lesson_ok else '?', status, q_cnt))

print('\n\n' + '='*60)
print('SUMMARY TABLE')
print('='*60)
print(f'{"Ch":<4} {"Theme":<35} {"Content":<8} {"Q Count"}')
print('-'*60)
for ch, theme, status, q_cnt in summary_rows:
    emoji = '⚠️ ' if status == 'MOCK' else '✅'
    print(f'{ch:<4} {theme[:34]:<35} {emoji}{status:<6} {q_cnt}')

print(f'\nTotal errors: {len(errors)}')
print(f'Total warnings: {len(warnings)}')
if errors:
    print('\nFAILED — fix errors above.')
    sys.exit(1)
else:
    print('\nPASSED — only warnings remain (if any).')
    sys.exit(0)
