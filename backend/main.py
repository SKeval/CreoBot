# SUPABASE MIGRATION REQUIRED - run this in Supabase SQL editor:
# ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_template text DEFAULT 'default';

from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from supabase import create_client
from groq import Groq
import smtplib
import os
import uuid
import io
import stripe
from datetime import datetime, timezone
from email.mime.text import MIMEText
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from rag import chunk_text, embed_chunks, store_embeddings, search_embeddings
import json


load_dotenv()

app = FastAPI()


@app.get("/")
def root():
    return {"status": "CreoBot API running"}


app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="."), name="static")

supabase = create_client(os.getenv("SUPABASE_URL"),
                         os.getenv("SUPABASE_SERVICE_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
SPARK_PRICE_ID = os.getenv("STRIPE_SPARK_PRICE_ID")
BLAZE_PRICE_ID = os.getenv("STRIPE_BLAZE_PRICE_ID")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

PLAN_LIMITS = {
    "free":  50,
    "spark": 1000,
    "blaze": None   # unlimited
}

TEMPLATES = {
    "default": "You are a helpful and friendly AI assistant for this business. Answer customer questions accurately and professionally.",
    "restaurant": "You are a warm and welcoming assistant for a restaurant or cafe. Help customers with menu questions, ingredients, allergens, reservations, opening hours, special events, and dietary requirements. Always be friendly and make customers feel welcome.",
    "real_estate": "You are a professional real estate assistant. Help buyers and sellers with property inquiries, viewing schedules, pricing questions, neighborhood information, and next steps. Be professional, clear, and helpful. Never make up property details - only answer from the knowledge base.",
    "ecommerce": "You are an efficient e-commerce assistant. Help customers with product questions, order status, returns, shipping times, and account issues. Be solution-focused and friendly. If you cannot resolve an issue, escalate to the human team.",
    "legal": "You are a professional assistant for a legal or professional services firm. Help potential clients understand services offered, book consultations, and answer general questions about the firm. Never give specific legal advice - always direct complex questions to a qualified professional.",
    "customer_service": "You are a dedicated customer service assistant. Help customers resolve issues, answer questions, and ensure a positive experience. Always be empathetic, patient, and solution-focused.",
}

sessions = {}

HIGH_INTENT_KEYWORDS = ["buy", "price", "pricing",
                        "book", "order", "purchase", "call", "contact", "quote"]


# ─── UTILS ───────────────────────────────────────────────────────────────────

def detect_confidence(reply: str) -> float:
    low_conf_phrases = ["i'm not sure", "i don't know", "i cannot find",
                        "unclear", "not certain", "i don't have that information"]
    score = 1.0
    for phrase in low_conf_phrases:
        if phrase in reply.lower():
            score -= 0.3
    return max(score, 0.0)


def is_high_intent(message: str) -> bool:
    return any(kw in message.lower() for kw in HIGH_INTENT_KEYWORDS)


def send_handoff_email(user_contact: str, user_message: str):
    try:
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
            server.login(os.getenv("GMAIL_USER"),
                         os.getenv("GMAIL_APP_PASSWORD"))
            server.send_message(msg)
    except Exception as e:
        print(f"⚠️ Handoff email failed: {e}")
        # Don't crash — just log and continue


def check_usage(user_id: str) -> bool:
    result = supabase.table("profiles").select(
        "plan, message_count, trial_ends_at, subscription_status"
    ).eq("id", user_id).execute()

    if not result.data:
        return True  # new user — allow

    profile = result.data[0]

    # Trial still active → unlimited access
    trial_ends = profile.get("trial_ends_at")
    if trial_ends:
        trial_dt = datetime.fromisoformat(trial_ends.replace("Z", "+00:00"))
        if datetime.now(timezone.utc) < trial_dt:
            return True

    plan = profile.get("plan", "free")
    limit = PLAN_LIMITS.get(plan)

    if limit is None:
        return True  # blaze = unlimited

    return profile.get("message_count", 0) < limit


def increment_usage(user_id: str):
    supabase.rpc("increment_message_count", {"uid": user_id}).execute()


def get_bot_template(user_id: str) -> str:
    try:
        result = supabase.table("profiles").select("bot_template").eq("id", user_id).execute()
        if result.data:
            return result.data[0].get("bot_template", "default") or "default"
    except Exception:
        pass
    return "default"


def resolve_plan(price_id: str) -> str:
    if price_id == SPARK_PRICE_ID:
        return "spark"
    elif price_id == BLAZE_PRICE_ID:
        return "blaze"
    return "free"


# ─── UPLOAD ──────────────────────────────────────────────────────────────────

@app.post("/upload")
async def upload_document(file: UploadFile = File(...), user_id: str = Form(...)):
    content = await file.read()

    if file.filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        text = " ".join(page.extract_text()
                        for page in reader.pages if page.extract_text())
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


# ─── TEMPLATE ────────────────────────────────────────────────────────────────

class TemplateRequest(BaseModel):
    user_id: str
    template: str


@app.post("/set-template")
async def set_template(req: TemplateRequest):
    valid = list(TEMPLATES.keys())
    if req.template not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid template. Choose from: {valid}")
    supabase.table("profiles").update({"bot_template": req.template}).eq("id", req.user_id).execute()
    return {"status": "ok", "template": req.template}


# ─── CHAT ────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    user_id: str


@app.post("/chat")
async def chat(req: ChatRequest):
    uid = req.user_id
    msg = req.message.strip()

    if uid not in sessions:
        sessions[uid] = {"history": [],
                         "awaiting_contact": False, "last_message": ""}

    session = sessions[uid]

    if not check_usage(uid):
        return {
            "reply": "You've reached your plan limit. Please upgrade to continue.",
            "handoff": False,
            "limit_reached": True
        }

    if session["awaiting_contact"]:
        send_handoff_email(msg, session["last_message"])
        session["awaiting_contact"] = False
        return {
            "reply": "Thanks! A team member will reach out to you shortly. Anything else I can help with?",
            "handoff": True
        }

    session["history"].append({"role": "user", "content": msg})
    session["last_message"] = msg

    context_chunks = search_embeddings(supabase, uid, msg)
    context = "\n\n".join(context_chunks) if context_chunks else ""

    template_key = get_bot_template(uid)
    persona = TEMPLATES.get(template_key, TEMPLATES["default"])

    system_prompt = f"""{persona}

Answer ONLY based on the information provided below.
If the answer is not in the context, say: "I don't have that information. Let me connect you with the team."
Never guess or make up information.
Format your answers clearly. Use bullet points for lists. Use short paragraphs. Bold key terms where helpful. Keep answers concise.

Business Knowledge Base:
{context if context else "No specific business data loaded yet."}"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            *session["history"]
        ]
    )

    reply = response.choices[0].message.content
    session["history"].append({"role": "assistant", "content": reply})

    increment_usage(uid)

    confidence = detect_confidence(reply)
    intent = is_high_intent(msg)

    if confidence < 0.8 or intent:
        session["awaiting_contact"] = True
        reply += "\n\nIt looks like you might need more personalized help. Could you share your email or phone number so our team can follow up directly?"
        return {"reply": reply, "handoff": True, "confidence": confidence}

    return {"reply": reply, "handoff": False, "confidence": confidence}


# ─── STRIPE ──────────────────────────────────────────────────────────────────

@app.post("/subscribe")
async def subscribe(req: Request):
    body = await req.json()
    user_id = body.get("user_id")
    email = body.get("email")
    plan = body.get("plan")

    if not all([user_id, email, plan]):
        raise HTTPException(status_code=400, detail="Missing fields")

    price_id = SPARK_PRICE_ID if plan == "spark" else BLAZE_PRICE_ID

    session = stripe.checkout.Session.create(
        customer_email=email,
        payment_method_types=["card"],
        mode="subscription",
        subscription_data={"trial_period_days": 14},
        line_items=[{"price": price_id, "quantity": 1}],
        success_url="https://creo-bot-tau.vercel.app/dashboard?success=true",
        cancel_url="https://creo-bot-tau.vercel.app/pricing?cancelled=true",
        metadata={"user_id": user_id, "plan": plan}
    )

    return {"checkout_url": session.url}


@app.post("/webhook")
async def stripe_webhook(req: Request):
    payload = await req.body()
    sig_header = req.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Parse as plain dict — avoids Stripe object access issues
    event_dict = json.loads(payload)
    obj = event_dict["data"]["object"]

    if event["type"] == "checkout.session.completed":
        metadata = obj.get("metadata") or {}
        user_id = metadata.get("user_id")
        plan = metadata.get("plan", "free")
        customer_id = obj.get("customer")

        if user_id:
            supabase.table("profiles").update({
                "plan": plan,
                "stripe_customer_id": customer_id,
                "subscription_status": "trialing",
                "message_count": 0
            }).eq("id", user_id).execute()

    elif event["type"] == "customer.subscription.updated":
        customer_id = obj.get("customer")
        status = obj.get("status")
        price_id = obj["items"]["data"][0]["price"]["id"]
        plan = resolve_plan(price_id)

        supabase.table("profiles").update({
            "plan": plan,
            "subscription_status": status
        }).eq("stripe_customer_id", customer_id).execute()

    elif event["type"] == "customer.subscription.deleted":
        customer_id = obj.get("customer")

        supabase.table("profiles").update({
            "plan": "free",
            "subscription_status": "cancelled"
        }).eq("stripe_customer_id", customer_id).execute()

    return {"status": "ok"}
