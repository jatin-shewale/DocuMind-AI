from langchain_huggingface import HuggingFaceEmbeddings

MODEL_MAP = {
    "bge": "BAAI/bge-small-en-v1.5",
    "minilm": "all-MiniLM-L6-v2",
}


def get_embeddings(model_name: str = "all-MiniLM-L6-v2", model_type: str | None = None):
    """
    Returns embedding model.

    Defaults to all-MiniLM-L6-v2 (fast, lightweight, good for local RAG).
    """
    if model_type:
        model_name = MODEL_MAP.get(model_type.lower(), model_name)

    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={"device": "cpu"},   # change to "cuda" if GPU available
        encode_kwargs={"normalize_embeddings": True},
    )

    return embeddings
