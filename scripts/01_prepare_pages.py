import os
import fitz  # PyMuPDF
import cv2
import numpy as np
import glob
import json

RAW_PAGES_DIR = 'data/raw/pages'
book_path = 'book.pdf'
CACHE_JSON = 'data/cache/prepare_cache.json'

def deskew(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    coords = np.column_stack(np.where(gray > 0))
    angle = cv2.minAreaRect(coords)[-1]
    
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
        
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated

def extract_and_process_pages():
    os.makedirs(RAW_PAGES_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(CACHE_JSON), exist_ok=True)
    
    cache = set()
    if os.path.exists(CACHE_JSON):
        with open(CACHE_JSON, 'r') as f:
            cache = set(json.load(f))
            
    try:
        doc = fitz.open(book_path)
    except Exception as e:
        print(f"Error opening {book_path}: {e}")
        return

    zoom = 200 / 72  # 200 DPI
    mat = fitz.Matrix(zoom, zoom)
    
    total_pages = len(doc)
    print(f"Total pages: {total_pages}")
    
    newly_processed = 0
    for i in range(total_pages):
        page_num_str = f"{i+1:03d}"
        if page_num_str in cache:
            continue
            
        print(f"Processing page {page_num_str} / {total_pages}")
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=mat)
        
        # Convert PyMuPDF pixmap to OpenCV image
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.h, pix.w, pix.n))
        
        # Convert to BGR for OpenCV if it's RGB
        if pix.n == 3:
            img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        elif pix.n == 4:
            img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGBA2BGR)
        else:
            img_bgr = cv2.cvtColor(img_array, cv2.COLOR_GRAY2BGR)
            
        # 1. Deskew
        img_bgr = deskew(img_bgr)
        
        # 2. Lighting Normalization (CLAHE)
        lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl,a,b))
        img_normalized = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        
        # 3. Mask out yellow highlights
        hsv = cv2.cvtColor(img_normalized, cv2.COLOR_BGR2HSV)
        # Define range of yellow color in HSV
        lower_yellow = np.array([20, 50, 50])
        upper_yellow = np.array([40, 255, 255])
        mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
        
        # Save yellow mask
        mask_path = os.path.join(RAW_PAGES_DIR, f"page_{page_num_str}_highlight.png")
        cv2.imwrite(mask_path, mask_yellow)
        
        # Remove yellow from the image to create masked copy 
        # Make the yellow parts white so they don't corrupt text
        img_masked = img_normalized.copy()
        img_masked[mask_yellow > 0] = [255, 255, 255]
        
        # Save original and masked
        orig_path = os.path.join(RAW_PAGES_DIR, f"page_{page_num_str}.png")
        cv2.imwrite(orig_path, img_normalized)
        
        masked_path = os.path.join(RAW_PAGES_DIR, f"page_{page_num_str}_masked.png")
        cv2.imwrite(masked_path, img_masked)
        
        newly_processed += 1
        
        # Update cache
        cache.add(page_num_str)
        with open(CACHE_JSON, 'w') as f:
            json.dump(list(cache), f)

    print(f"Finished processing. Processed {newly_processed} new pages.")

if __name__ == '__main__':
    extract_and_process_pages()
