import os
import shutil
from typing import List

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import Body

from src.embeddings.embedding_model import get_embeddings
from src.ingestion.loader import load_pdf
from src.ingestion.splitter import split_documents
from src.rag.prompt import get_prompt
from src.retrieval.retriever import get_retriever
from src.retrieval.reranker import rerank
from src.vectorstore.chroma_store import create_db, load_db
from langchain_ollama import OllamaLLM

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
DB_DIR = os.path.join(BASE_DIR, "db")

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="DocuMind AI Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = get_embeddings(model_type="bge")
llm = OllamaLLM(model="llama3")
prompt = get_prompt()

vectorstore = load_db(embeddings) if os.path.exists(DB_DIR) else None


class QueryRequest(BaseModel):
    query: str


class DeleteRequest(BaseModel):
    name: str


def _safe_rmtree(path: str):
    abs_path = os.path.abspath(path)
    if not abs_path.startswith(BASE_DIR):
        raise RuntimeError("Refusing to delete outside project directory.")
    if os.path.exists(abs_path):
        shutil.rmtree(abs_path)


def _ingest_files(file_paths: List[str]):
    all_docs = []
    for path in file_paths:
        docs = load_pdf(path)
        for d in docs:
            d.metadata["source"] = os.path.basename(path)
        all_docs.extend(docs)

    if not all_docs:
        return None

    chunks = split_documents(all_docs)
    return chunks


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/documents")
def list_documents():
    files = [
        f
        for f in os.listdir(UPLOAD_DIR)
        if f.lower().endswith(".pdf") and os.path.isfile(os.path.join(UPLOAD_DIR, f))
    ]
    return {"documents": sorted(files)}


@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")

    saved_paths = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        destination = os.path.join(UPLOAD_DIR, file.filename)
        with open(destination, "wb") as buffer:
            buffer.write(await file.read())
        saved_paths.append(destination)

    chunks = _ingest_files(saved_paths)
    if not chunks:
        raise HTTPException(status_code=400, detail="No content extracted from PDFs.")

    global vectorstore
    if vectorstore is None:
        vectorstore = create_db(chunks, embeddings)
    else:
        vectorstore.add_documents(chunks)
    try:
        vectorstore.persist()
    except Exception:
        pass

    return {"uploaded": [os.path.basename(p) for p in saved_paths]}


@app.delete("/documents")
def delete_document(payload: DeleteRequest = Body(...)):
    name = payload.name

    target = os.path.join(UPLOAD_DIR, name)
    if os.path.exists(target):
        os.remove(target)

    remaining = [
        os.path.join(UPLOAD_DIR, f)
        for f in os.listdir(UPLOAD_DIR)
        if f.lower().endswith(".pdf")
    ]

    global vectorstore
    vectorstore = None
    _safe_rmtree(DB_DIR)

    if remaining:
        chunks = _ingest_files(remaining)
        if chunks:
            vectorstore = create_db(chunks, embeddings)
            try:
                vectorstore.persist()
            except Exception:
                pass

    return {"deleted": name}


@app.post("/query")
def query_rag(payload: QueryRequest):
    if vectorstore is None:
        raise HTTPException(status_code=400, detail="Vector DB is empty. Upload PDFs first.")

    question = payload.query.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Query is empty.")

    retriever = get_retriever(vectorstore)
    docs = retriever.invoke(question)
    if not docs:
        return {"answer": "I don't know based on the provided documents.", "sources": []}

    reranked_docs = rerank(question, docs)
    if not reranked_docs:
        return {"answer": "I don't know based on the provided documents.", "sources": []}

    context = "\n\n".join(
        f"{doc.page_content}\nSOURCE: {doc.metadata.get('source')}"
        for doc in reranked_docs
    )
    formatted = prompt.format(context=context, question=question)
    answer = llm.invoke(formatted)

    sources = []
    for doc in reranked_docs:
        source = doc.metadata.get("source") or "source"
        page = doc.metadata.get("page")
        sources.append(
            {
                "file": source,
                "page": (page + 1) if isinstance(page, int) else None,
            }
        )

    return {"answer": answer, "sources": sources}
