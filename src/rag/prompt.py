from langchain_core.prompts import ChatPromptTemplate

def get_prompt():
    return ChatPromptTemplate.from_template("""
    You are a helpful assistant for a document Q&A system.

    Rules:
    - Answer ONLY using the provided context.
    - If the context is empty or insufficient, say: "I don't know based on the provided documents."
    - Always include sources from the context.

    <context>
    {context}
    </context>

    Question: {question}
    """)
