from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from groq import Groq
import os
import uuid
import io
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from rag import chunk_text, embed_chunks, store_embeddings, search_embeddings

load_dotenv()
print("SERVICE KEY:", os.getenv("SUPABASE_SERVICE_KEY")[:40] if os.getenv("SUPABASE_SERVICE_KEY") else "MISSING")
print("ANON KEY:", os.getenv("SUPABASE_ANON_KEY")[:40] if os.getenv("SUPABASE_ANON_KEY") else "MISSING")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.get("/")
def root():
    return {"status": "CreoBot API running"}

@app.get("/health")
def health():
    return {"status": "ok", "supabase": "connected"}

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    content = await file.read()

    if file.filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        text = " ".join(page.extract_text() for page in reader.pages if page.extract_text())
    else:
        text = content.decode("utf-8")

    document_id = str(uuid.uuid4())
    supabase.table("documents").insert({
        "id": document_id,
        "user_id": user_id,
        "name": file.filename,
        "content": text
    }).execute()

    chunks = chunk_text(text)
    embeddings = embed_chunks(chunks)
    store_embeddings(supabase, user_id, document_id, chunks, embeddings)

    return {"status": "uploaded", "chunks": len(chunks), "document_id": document_id}

@app.get("/test-db")
def test_db():
    try:
        result = supabase.table("documents").select("*").limit(1).execute()
        return {"status": "ok", "data": result.data}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.post("/chat")
def chat(payload: dict):
    user_message = payload.get("message")
    user_id = payload.get("user_id")

    context_chunks = search_embeddings(supabase, user_id, user_message)
    context = "\n\n".join(context_chunks) if context_chunks else ""

    system_prompt = f"""You are a helpful business assistant.
Answer ONLY based on the information provided below.
If the answer is not in the context, say: "I don't have that information — let me connect you with the team."
Never guess or make up information.

Business Knowledge Base:
{context}
"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )

    return {"reply": response.choices[0].message.content}