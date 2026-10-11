import os

dirs = [
    'scripts',
    'data/raw/pages',
    'data/cache',
    'data/chapters',
    'data/reports',
    'public/figures'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    
print("Created directories.")
