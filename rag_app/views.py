import os
import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage

from .services.rag_engine import query_rag, index_uploaded_pdf

# Directory where uploaded PDFs will be saved
UPLOAD_DIR = os.path.join("rag_app", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)  # make sure folder exists


# -------------------------
# QUERY VIEW
# -------------------------
@csrf_exempt
def query_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body)
        question = data.get("question")

        if not question:
            return JsonResponse({"error": "Question is required"}, status=400)

        results = query_rag(question)

        return JsonResponse({
            "question": question,
            "results": results
        })

    except Exception as e:
        # Log full traceback for debugging
        print("Exception in query_view:")
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)


# -------------------------
# UPLOAD PDF VIEW
# -------------------------
@csrf_exempt
def upload_pdf(request):
    try:
        print("Request method:", request.method)
        print("FILES:", request.FILES)
        print("POST:", request.POST)

        if request.method != "POST":
            return JsonResponse({"error": "POST required"}, status=400)

        # React uploads the file as "pdf" key in FormData
        if "pdf" not in request.FILES:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        pdf_file = request.FILES["pdf"]
        print("Received file:", pdf_file.name, pdf_file.size)

        # Save the uploaded file
        fs = FileSystemStorage(location=UPLOAD_DIR)
        filename = fs.save(pdf_file.name, pdf_file)
        file_path = os.path.join(UPLOAD_DIR, filename)
        print("File saved at:", file_path)

        # Index the uploaded PDF (your RAG engine)
        index_uploaded_pdf(file_path)

        return JsonResponse({
            "message": "File uploaded and indexed successfully",
            "file": filename
        })

    except Exception as e:
        # Catch all exceptions and log for debugging
        print("Exception in upload_pdf:")
        traceback.print_exc()
        return JsonResponse({"error": "Server error: " + str(e)}, status=500)
