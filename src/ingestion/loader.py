from langchain_community.document_loaders import PyPDFLoader


def load_pdf(file_path: str):
    """
    Load a PDF file and return a list of LangChain Documents.
    """
    loader = PyPDFLoader(file_path)
    return loader.load()
