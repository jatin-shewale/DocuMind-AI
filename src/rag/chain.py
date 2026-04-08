from langchain_ollama import OllamaLLM
from langchain_core.runnables import RunnableLambda
from src.retrieval.retriever import get_retriever
from src.retrieval.reranker import rerank
from src.rag.prompt import get_prompt


def get_rag_chain(vectorstore):
    llm = OllamaLLM(model="llama3")
    retriever = get_retriever(vectorstore)
    prompt = get_prompt()

    def answer(question: str) -> str:
        docs = retriever.invoke(question)
        if not docs:
            return "I don't know based on the provided documents."

        reranked_docs = rerank(question, docs)
        if not reranked_docs:
            return "I don't know based on the provided documents."

        context = "\n\n".join(
            f"{doc.page_content}\nSOURCE: {doc.metadata.get('source')}"
            for doc in reranked_docs
        )

        formatted = prompt.format(context=context, question=question)
        return llm.invoke(formatted)

    return RunnableLambda(answer)
