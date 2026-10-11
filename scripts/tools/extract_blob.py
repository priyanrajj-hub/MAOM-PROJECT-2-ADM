import subprocess, glob

idx_file = glob.glob('.git/objects/pack/*.idx')[0]
out = subprocess.check_output(['git', 'verify-pack', '-v', idx_file]).decode()
lines = out.split('\n')
blobs = [l for l in lines if 'blob' in l and len(l.split()) >= 3]
blobs.sort(key=lambda x: int(x.split()[2]), reverse=True)
largest_blob_hash = blobs[0].split()[0]
print(f"Largest blob hash: {largest_blob_hash}")
print(f"Size: {blobs[0].split()[2]} bytes")

with open('book.pdf', 'wb') as f:
    f.write(subprocess.check_output(['git', 'cat-file', '-p', largest_blob_hash]))
print("Saved largest blob to book.pdf")
