def get_retriever(vectorstore):
    return vectorstore.as_retriever(search_kwargs={"k": 5})