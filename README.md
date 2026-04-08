# DocuMind AI Pro ? Multi-Document Conversational RAG System

## Overview

DocuMind AI Pro is an advanced Retrieval-Augmented Generation (RAG) system that allows users to chat with multiple PDF documents using a local Large Language Model. Instead of manually reading long documents, users can ask questions and get accurate, context-aware answers grounded in the document content.

## Key Features

- Multi-PDF upload and processing
- Semantic search using embeddings
- Vector database (Chroma)
- Local LLM via Ollama (Llama 3)
- Conversational chat (RAG pipeline)
- Source citation (document traceability)
- Reranking for improved accuracy
- RAG evaluation using RAGAS
- React UI + Streamlit UI

## Screenshots

Landing page preview:

![DocuMind AI Pro Landing](docs/screenshots/landing-page.png)

Dashboard preview:

![DocuMind AI Pro Dashboard](docs/screenshots/dashboard.png)

## System Architecture (Mermaid)

```mermaid
flowchart LR
    classDef ingest fill:#e0f2fe,stroke:#38bdf8,stroke-width:1px,color:#0f172a
    classDef embed fill:#ecfccb,stroke:#84cc16,stroke-width:1px,color:#0f172a
    classDef store fill:#ffe4e6,stroke:#fb7185,stroke-width:1px,color:#0f172a
    classDef retrieve fill:#fef3c7,stroke:#f59e0b,stroke-width:1px,color:#0f172a
    classDef rank fill:#ede9fe,stroke:#8b5cf6,stroke-width:1px,color:#0f172a
    classDef generate fill:#dbeafe,stroke:#3b82f6,stroke-width:1px,color:#0f172a
    classDef ui fill:#f3e8ff,stroke:#a855f7,stroke-width:1px,color:#0f172a
    classDef api fill:#dcfce7,stroke:#22c55e,stroke-width:1px,color:#0f172a

    subgraph UI[Frontend]
        U1[React UI\nUpload + Chat]:::ui
        U2[Streamlit UI]:::ui
    end

    subgraph API[Backend API]
        A1[FastAPI Endpoints\n/upload /query /documents]:::api
    end

    subgraph ING[Ingestion]
        I1[PDF Loader]:::ingest
        I2[Splitter]:::ingest
        I3[Metadata + Source Tagging]:::ingest
    end

    subgraph EMB[Embeddings]
        E1[HuggingFace Embeddings]:::embed
    end

    subgraph STORE[Vector Store]
        S1[Chroma DB]:::store
    end

    subgraph RETR[Retrieval]
        R1[Top-K Retriever]:::retrieve
        R2[Reranker]:::rank
    end

    subgraph GEN[Generation]
        G1[Prompt Template]:::generate
        G2[LLM (Ollama Llama 3)]:::generate
        G3[Answer + Sources]:::generate
    end

    U1 --> A1
    U2 --> A1
    A1 --> I1 --> I2 --> I3 --> E1 --> S1
    A1 --> R1 --> R2 --> G1 --> G2 --> G3
    S1 --> R1
```

## Usage

### Run CLI App

```bash
python app.py
```

### Run API Server (for React UI)

```bash
python -m pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

### Run React UI

```bash
cd UI
npm install
npm run dev
```

### Run Streamlit UI

```bash
streamlit run ui/streamlit_app.py
```

## Add Documents

1. Place PDFs inside:

```
data/
```

2. Run the app ? embeddings will be created automatically.

## How It Works

### Step 1: Document Ingestion

- PDFs are loaded and split into chunks
- Metadata (source, page) is attached

### Step 2: Embeddings

- Text is converted into vectors using HuggingFace models

### Step 3: Vector Storage

- Stored in Chroma DB for fast similarity search

### Step 4: Retrieval

- Top-k relevant chunks are fetched

### Step 5: Reranking

- Improves relevance of retrieved chunks

### Step 6: Generation

- LLM generates answer using retrieved context

## Evaluation

This project uses RAGAS to evaluate performance.

### Metrics Used

- Faithfulness
- Answer relevancy
- Context precision

### Run Evaluation

```bash
python src/evaluation/ragas_eval.py
```

## Sample Query

```
Q: Why does Apple use personal data?

A: Apple uses personal data to provide services, process transactions, ensure security, and comply with legal obligations.
Source: apple-privacy-policy.pdf
```

## Tech Stack

- Python
- LangChain
- ChromaDB
- HuggingFace Transformers
- Ollama (Llama 3)
- Streamlit
- React + Vite + Tailwind

## Advanced Features

- Multi-document retrieval
- Hybrid search (extendable)
- Reranking model integration
- Persistent vector database
- Modular architecture

## Future Enhancements

- User authentication
- Web search integration
- Evaluation dashboard
- Cloud deployment (AWS / Hugging Face)
- Memory-based conversations

## Learning Outcomes

- Understanding of RAG architecture
- Vector databases and embeddings
- LLM integration (local models)
- Evaluation of AI systems
- Building end-to-end AI applications

## Author

Jatin Shewale

## Acknowledgment

Inspired by modern AI systems and RAG-based architectures used in industry.

## License

This project is for educational and research purposes.
