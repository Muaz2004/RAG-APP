import os
from typing import List

from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings


# -----------------------------
# Configuration
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VECTOR_STORE_PATH = os.path.join(BASE_DIR, "vector_store")

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHUNK_SIZE = 500        # characters
CHUNK_OVERLAP = 100     # characters
TOP_K = 3


# -----------------------------
# Load embedding model (once)
# -----------------------------

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)


# -----------------------------
# Vector DB (persistent)
# -----------------------------

chroma_client = chromadb.Client(
    Settings(
        persist_directory=VECTOR_STORE_PATH,
        anonymized_telemetry=False
    )
)

collection = chroma_client.get_or_create_collection(
    name="rag_documents"
)


# -----------------------------
# 1. Load PDF
# -----------------------------

def load_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return text


# -----------------------------
# 2. Chunk text
# -----------------------------

def chunk_text(text: str) -> List[str]:
    chunks = []
    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - CHUNK_OVERLAP

    return chunks


# -----------------------------
# 3. Create embeddings
# -----------------------------

def embed_texts(texts: List[str]) -> List[List[float]]:
    return embedding_model.encode(texts).tolist()


# -----------------------------
# 4. Index document (PDF → vectors)
# -----------------------------

def index_pdf(pdf_path: str):
    text = load_pdf(pdf_path)
    chunks = chunk_text(text)
    embeddings = embed_texts(chunks)

    ids = [f"chunk_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

    chroma_client.persist()


# -----------------------------
# 5. Retrieve relevant chunks
# -----------------------------

def retrieve(query: str, top_k: int = TOP_K) -> List[str]:
    query_embedding = embed_texts([query])[0]

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results["documents"][0]
