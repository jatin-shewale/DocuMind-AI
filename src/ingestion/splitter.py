from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents, chunk_size: int = 1000, chunk_overlap: int = 150):
    """
    Split documents into chunks for retrieval.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_documents(documents)
