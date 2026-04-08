"""
DocuMind AI Pro - CLI Application
Supports:
- Multi-PDF ingestion
- Persistent Vector DB
- Advanced RAG Pipeline
"""

import os

# ✅ New modular imports (UPDATED STRUCTURE)
from src.ingestion.pipeline import ingest_documents
from src.vectorstore.chroma_store import load_db
from src.embeddings.embedding_model import get_embeddings
from src.rag.chain import get_rag_chain

DATA_FOLDER = "data"


def get_all_pdfs(folder_path):
    """
    Load all PDFs from data folder
    """
    pdf_files = []

    for file in os.listdir(folder_path):
        if file.endswith(".pdf"):
            pdf_files.append(os.path.join(folder_path, file))

    return pdf_files


def main():
    print("🚀 Starting DocuMind AI Pro...\n")

    # 🔹 Load embeddings
    embeddings = get_embeddings(model_type="bge")

    # 🔹 Check if DB exists
    if not os.path.exists("db"):
        print("📄 No existing DB found. Ingesting documents...\n")

        pdf_paths = get_all_pdfs(DATA_FOLDER)

        if not pdf_paths:
            print("❌ No PDFs found in /data folder.")
            return

        print(f"📂 Found {len(pdf_paths)} PDFs")

        vectordb = ingest_documents(pdf_paths)

        print("✅ Documents processed and stored in DB\n")

    else:
        print("📦 Loading existing Vector DB...\n")
        vectordb = load_db(embeddings)

    # 🔹 Build RAG pipeline
    rag_chain = get_rag_chain(vectordb)

    print("🤖 System Ready! Ask your questions.\n")

    # 🔹 Chat loop
    while True:
        query = input("💬 You: ")

        if query.lower() in ["exit", "quit"]:
            print("👋 Exiting DocuMind AI Pro...")
            break

        try:
            response = rag_chain.invoke(query)

            print("\n🤖 Answer:\n")
            print(response)
            print("\n" + "-" * 50)

        except Exception as e:
            print(f"⚠️ Error: {e}")


if __name__ == "__main__":
    main()