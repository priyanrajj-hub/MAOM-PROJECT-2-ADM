import subprocess
import os

pdf_filename = b'DAI PARAMA PADI DA - THIS SHIT IS PART OF AN (AIZEN)_compress.pdf'
# Get the hash of the file from HEAD~1
out = subprocess.check_output(['git', 'ls-tree', 'HEAD~1'])
file_hash = None
for line in out.split(b'\n'):
    if pdf_filename in line:
        file_hash = line.split(b'\t')[0].split()[2].decode('utf-8')
        break

if file_hash:
    pdf_content = subprocess.check_output(['git', 'cat-file', '-p', file_hash])
    with open('book.pdf', 'wb') as f:
        f.write(pdf_content)
    print("Successfully extracted book.pdf. Size:", len(pdf_content))
else:
    print("Could not find the pdf in git history.")
