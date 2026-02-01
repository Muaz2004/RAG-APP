from rag_engine import index_pdf, retrieve

# 1. Index the document (RUN ONCE)
index_pdf("test_docs/sample.pdf")

# 2. Ask a question
query = "What is TCP?"
results = retrieve(query)

print("\n--- Retrieved Chunks ---\n")
for i, chunk in enumerate(results, 1):
    print(f"[{i}]\n{chunk}\n")
