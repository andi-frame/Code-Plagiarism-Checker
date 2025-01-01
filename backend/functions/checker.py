import re
import numpy as np
from collections import Counter

def preprocess_code(code):
    """
    Fungsi untuk melakukan preprocessing pada kode program.
    - Menghapus komentar
    - Menghapus baris kosong
    """
    # Menghapus komentar
    code = re.sub(r'#.*', '', code)
    
    # Menghapus komentar blok
    code = re.sub(r'"""[\s\S]*?"""', '', code)
    
    # Menghapus baris kosong
    code = "\n".join([s for s in code.splitlines() if s.strip()])
    
    return code

def tokenize_code(code):
    """
    Fungsi untuk melakukan tokenisasi pada kode program.
    """
    # Split berdasarkan spasi dan karakter khusus
    tokens = re.findall(r'\w+|[^\s\w]', code)
    return tokens

def cosine_similarity(vec1, vec2):
    """
    Fungsi untuk menghitung cosine similarity antara dua vektor.
    """
    dot_product = np.dot(vec1, vec2)
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    return dot_product / (norm_vec1 * norm_vec2)

def calculate_cosine_similarity(code1, code2):
    """
    Fungsi untuk menghitung cosine similarity antara dua kode program.
    """
    tokens1 = tokenize_code(code1)
    tokens2 = tokenize_code(code2)
    
    # Menghitung frekuensi token
    counter1 = Counter(tokens1)
    counter2 = Counter(tokens2)
    
    # Gabungan semua token unik
    all_tokens = list(set(counter1.keys()).union(set(counter2.keys())))
    
    # Membuat vektor frekuensi token
    vec1 = np.array([counter1[token] for token in all_tokens])
    vec2 = np.array([counter2[token] for token in all_tokens])
    
    return cosine_similarity(vec1, vec2)
