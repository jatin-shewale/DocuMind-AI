from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset

# Your project imports
from src.vectorstore.chroma_store import load_db
from src.embeddings.embedding_model import get_embeddings
from src.rag.chain import get_rag_chain


def build_dataset(rag_chain, vectordb):
    """
    Builds evaluation dataset using sample questions
    """

    # 🔥 You can expand this list later
    eval_data = [
        {
            "question": "Why does Apple use personal data?",
            "ground_truth": "Apple uses personal data to provide services, process transactions, ensure security, prevent fraud, and comply with law."
        },
        {
            "question": "How does Apple ensure user security?",
            "ground_truth": "Apple ensures security through fraud prevention, monitoring, and protecting user data."
        },
        {
            "question": "Does Apple use data for communication?",
            "ground_truth": "Yes, Apple uses personal data to communicate with users."
        }
    ]

    questions = []
    answers = []
    contexts = []
    ground_truths = []

    retriever = vectordb.as_retriever(search_kwargs={"k": 5})

    for item in eval_data:
        question = item["question"]

        # 🔹 Generate answer
        response = rag_chain.invoke(question)
        answer = str(response)

        # 🔹 Retrieve context separately
        retrieved_docs = retriever.invoke(question)
        context_list = [doc.page_content for doc in retrieved_docs]

        # Store
        questions.append(question)
        answers.append(answer)
        contexts.append(context_list)
        ground_truths.append(item["ground_truth"])

    dataset = Dataset.from_dict({
        "question": questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths
    })

    return dataset


def run_evaluation():
    print("🚀 Starting RAG Evaluation...\n")

    # 🔹 Load embedding + DB
    embeddings = get_embeddings(model_type="bge")
    vectordb = load_db(embeddings)

    # 🔹 Build RAG pipeline
    rag_chain = get_rag_chain(vectordb)

    # 🔹 Build dataset
    dataset = build_dataset(rag_chain, vectordb)

    # 🔹 Run evaluation
    result = evaluate(
        dataset,
        metrics=[
            faithfulness,
            answer_relevancy,
            context_precision
        ]
    )

    print("\n📊 RAG Evaluation Results:\n")
    print(result)

    print("\n✅ Done!")


if __name__ == "__main__":
    run_evaluation()