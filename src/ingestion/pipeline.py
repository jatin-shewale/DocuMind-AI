from .loader import load_pdf
from .splitter import split_documents
from src.vectorstore.chroma_store import create_db
from src.embeddings.embedding_model import get_embeddings

def ingest_documents(file_paths):
    all_docs = []

    for path in file_paths:
        docs = load_pdf(path)
        for d in docs:
            d.metadata["source"] = path
        all_docs.extend(docs)

    chunks = split_documents(all_docs)
    embeddings = get_embeddings()

    vectordb = create_db(chunks, embeddings)
    return vectordb