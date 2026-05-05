from sentence_transformers import SentenceTransformer
from supabase import Client
import numpy as np

# Free local embedding model — no API cost
model = SentenceTransformer("all-MiniLM-L6-v2")

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks

def embed_chunks(chunks: list[str]) -> list[list[float]]:
    embeddings = model.encode(chunks)
    return [e.tolist() for e in embeddings]

def store_embeddings(supabase: Client, user_id: str, document_id: str, chunks: list[str], embeddings: list[list[float]]):
    rows = [
        {
            "user_id": user_id,
            "document_id": document_id,
            "content": chunk,
            "embedding": embedding
        }
        for chunk, embedding in zip(chunks, embeddings)
    ]
    supabase.table("embeddings").insert(rows).execute()

def search_embeddings(supabase: Client, user_id: str, query: str, top_k: int = 5) -> list[str]:
    query_embedding = model.encode([query])[0].tolist()

    result = supabase.rpc("match_embeddings", {
        "query_embedding": query_embedding,
        "match_user_id": user_id,
        "match_count": top_k
    }).execute()

    return [row["content"] for row in result.data]