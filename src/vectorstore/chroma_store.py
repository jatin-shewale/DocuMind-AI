from langchain_community.vectorstores import Chroma

def create_db(chunks, embeddings):
    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./db"
    )

def load_db(embeddings=None):
    return Chroma(
        persist_directory="./db",
        embedding_function=embeddings
    )