from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from supabase import create_client
from groq import Groq
import smtplib, os, re
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="."), name="static")

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

sessions = {}

HIGH_INTENT_KEYWORDS = ["buy", "price", "pricing", "book", "order", "purchase", "call", "contact", "quote"]

class ChatRequest(BaseModel):
    message: str
    user_id: str

def detect_confidence(reply: str) -> float:
    low_conf_phrases = ["i'm not sure", "i don't know", "i cannot find", "unclear", "not certain", "i don't have that information"]
    score = 1.0
    for phrase in low_conf_phrases:
        if phrase in reply.lower():
            score -= 0.3
    return max(score, 0.0)

def is_high_intent(message: str) -> bool:
    return any(kw in message.lower() for kw in HIGH_INTENT_KEYWORDS)

def send_handoff_email(user_contact: str, user_message: str):
    msg = MIMEText(
        f"🚨 CreoBot Handoff Alert\n\n"
        f"A customer needs your attention.\n\n"
        f"Customer contact: {user_contact}\n"
        f"Their message: \"{user_message}\"\n\n"
        f"Reply to them as soon as possible."
    )
    msg["Subject"] = "🚨 New Lead — CreoBot Handoff"
    msg["From"] = os.getenv("GMAIL_USER")
    msg["To"] = os.getenv("OWNER_EMAIL")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_APP_PASSWORD"))
        server.send_message(msg)

@app.post("/chat")
async def chat(req: ChatRequest):
    uid = req.user_id
    msg = req.message.strip()

    if uid not in sessions:
        sessions[uid] = {"history": [], "awaiting_contact": False, "last_message": ""}

    session = sessions[uid]

    if session["awaiting_contact"]:
        send_handoff_email(msg, session["last_message"])
        session["awaiting_contact"] = False
        return {
            "reply": "Thanks! A team member will reach out to you shortly. Anything else I can help with?",
            "handoff": True
        }

    session["history"].append({"role": "user", "content": msg})
    session["last_message"] = msg

    system_prompt = """You are a helpful AI assistant for this business.
Answer ONLY based on the information provided below.
If the answer is not in the context, say: "I don't have that information — let me connect you with the team."
Never guess or make up information.

Business Knowledge Base: No specific business data loaded yet."""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            *session["history"]
        ]
    )

    reply = response.choices[0].message.content
    session["history"].append({"role": "assistant", "content": reply})

    confidence = detect_confidence(reply)
    intent = is_high_intent(msg)

    if confidence < 0.8 or intent:
        session["awaiting_contact"] = True
        reply += "\n\nIt looks like you might need more personalized help. Could you share your email or phone number so our team can follow up directly?"
        return {"reply": reply, "handoff": True, "confidence": confidence}

    return {"reply": reply, "handoff": False, "confidence": confidence}