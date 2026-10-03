import os
import json
import glob
from rapidfuzz import fuzz

TRANSCRIPTS_DIR = 'data/raw/transcripts'
REPORTS_DIR = 'data/reports'
CACHE_DIR = 'data/cache'

def dedupe_and_order():
    os.makedirs(REPORTS_DIR, exist_ok=True)
    os.makedirs(CACHE_DIR, exist_ok=True)
    
    files = glob.glob(os.path.join(TRANSCRIPTS_DIR, '*.json'))
    pages = []
    low_confidence = []
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
                pages.append(data)
                
                # Report low confidence
                if data.get('confidence', 1.0) < 0.85:
                    low_confidence.append(data.get('pdf_page'))
            except Exception as e:
                print(f"Error reading {f}: {e}")
                
    # Save low confidence report
    with open(os.path.join(REPORTS_DIR, 'low_confidence.json'), 'w') as f:
        json.dump(low_confidence, f, indent=2)
        
    # Group by printed page
    by_printed = {}
    for p in pages:
        printed = p.get('printed_page')
        # If printed_page is missing, we infer it from pdf_page roughly
        if printed is None:
            printed = p.get('pdf_page') # Fallback
            
        if printed not in by_printed:
            by_printed[printed] = []
        by_printed[printed].append(p)
        
    deduped = []
    duplicates_dropped = []
    
    for printed, group in by_printed.items():
        if len(group) == 1:
            deduped.append(group[0])
            continue
            
        # We have multiple captures of the same printed page
        # Dedupe by similarity using rapidfuzz
        unique_group = [group[0]]
        for i in range(1, len(group)):
            text_i = " ".join([b['text'] for b in group[i].get('blocks', [])])
            
            is_dupe = False
            for u in unique_group:
                text_u = " ".join([b['text'] for b in u.get('blocks', [])])
                sim = fuzz.ratio(text_i, text_u)
                if sim > 90:
                    is_dupe = True
                    # Keep the one with higher confidence
                    if group[i].get('confidence', 0.0) > u.get('confidence', 0.0):
                        duplicates_dropped.append(u.get('pdf_page'))
                        unique_group[unique_group.index(u)] = group[i]
                    else:
                        duplicates_dropped.append(group[i].get('pdf_page'))
                        
                    break
            if not is_dupe:
                unique_group.append(group[i])
                
        deduped.extend(unique_group)
        
    # Sort by printed page
    deduped.sort(key=lambda x: x.get('printed_page') if x.get('printed_page') is not None else getattr(x, 'pdf_page', 0))
    
    # Save duplicates dropped
    with open(os.path.join(REPORTS_DIR, 'duplicates.json'), 'w') as f:
        json.dump(duplicates_dropped, f, indent=2)
        
    # Check for missing printed pages (only checking within min and max of found)
    printed_nums = [p.get('printed_page') for p in deduped if isinstance(p.get('printed_page'), int)]
    missing = []
    if printed_nums:
        min_p, max_p = min(printed_nums), max(printed_nums)
        expected = set(range(min_p, max_p + 1))
        actual = set(printed_nums)
        missing = sorted(list(expected - actual))
        
    with open(os.path.join(REPORTS_DIR, 'missing_pages.json'), 'w') as f:
        json.dump(missing, f, indent=2)
        
    # Save ordered cache
    with open(os.path.join(CACHE_DIR, 'ordered_pages.json'), 'w', encoding='utf-8') as f:
        json.dump(deduped, f, indent=2, ensure_ascii=False)
        
    print(f"Deduplication complete. Dropped {len(duplicates_dropped)} duplicates. Found {len(missing)} missing pages in the range.")
    print(f"Saved {len(deduped)} ordered pages.")
    
if __name__ == '__main__':
    dedupe_and_order()
