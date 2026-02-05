# views.py
import os
import pickle
import PyPDF2
import faiss
from sentence_transformers import SentenceTransformer
from threading import Thread
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

# ---------------- CONFIG ----------------
VECTOR_DIR = "vector_db"
INDEX_PATH = os.path.join(VECTOR_DIR, "faiss.index")
CHUNKS_PATH = os.path.join(VECTOR_DIR, "chunks.pkl")
CHUNK_SIZE = 500
OVERLAP = 100
TOP_K = 3

# ---------------- GLOBAL MODEL ----------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------- PDF FUNCTIONS ----------------
def load_pdf_text(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text


def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=OVERLAP):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


# ---------------- INDEXING ----------------

def index_document(pdf_path):
    print("Loading PDF for indexing...")
    text = load_pdf_text(pdf_path)

    print("Chunking text...")
    new_chunks = chunk_text(text)
    print(f"New chunks: {len(new_chunks)}")

    print("Creating embeddings...")
    new_embeddings = embedding_model.encode(
        new_chunks, batch_size=32
    ).astype("float32")

    os.makedirs(VECTOR_DIR, exist_ok=True)

    # ---------------- LOAD OR CREATE INDEX ----------------
    if os.path.exists(INDEX_PATH) and os.path.exists(CHUNKS_PATH):
        print("Existing index found. Appending data...")

        index = faiss.read_index(INDEX_PATH)

        with open(CHUNKS_PATH, "rb") as f:
            all_chunks = pickle.load(f)

    else:
        print("No index found. Creating new one...")
        dim = new_embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        all_chunks = []

    # ---------------- APPEND DATA ----------------
    index.add(new_embeddings)
    all_chunks.extend(new_chunks)

    # ---------------- SAVE BACK ----------------
    faiss.write_index(index, INDEX_PATH)
    with open(CHUNKS_PATH, "wb") as f:
        pickle.dump(all_chunks, f)

    print(f"Index now contains {len(all_chunks)} total chunks.")


def load_index():
    index = faiss.read_index(INDEX_PATH)
    with open(CHUNKS_PATH, "rb") as f:
        chunks = pickle.load(f)
    return index, chunks


def retrieve(query, top_k=TOP_K):
    index, chunks = load_index()
    query_embedding = embedding_model.encode([query]).astype("float32")
    distances, indices = index.search(query_embedding, top_k)
    return [chunks[i] for i in indices[0]]


def async_index(pdf_path):
    thread = Thread(target=index_document, args=(pdf_path,))
    thread.start()
    return thread


# ---------------- DJANGO VIEW ----------------
@csrf_exempt
def upload_pdf(request):
    if request.method == "POST" and request.FILES.get("pdf"):
        pdf_file = request.FILES["pdf"]
        saved_path = default_storage.save(f"uploads/{pdf_file.name}", pdf_file)

        # Start indexing in background
        async_index(saved_path)

        return JsonResponse({"status": "Upload received. Indexing in progress."})

    return JsonResponse({"error": "No PDF uploaded"}, status=400)


@csrf_exempt
def query_view(request):
    if request.method == "POST":
        import json
        data = json.loads(request.body)
        question = data.get("question", "")
        if not question:
            return JsonResponse({"error": "No question provided"}, status=400)

        # Retrieve top chunks
        try:
            results = retrieve(question)
        except Exception:
            return JsonResponse({"error": "No index found yet. Upload a PDF first."}, status=400)

        return JsonResponse({"results": results})

    return JsonResponse({"error": "Invalid request"}, status=400)
