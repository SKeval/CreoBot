from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from supabase import create_client
from groq import Groq
import smtplib, os, uuid, io, stripe
from datetime import datetime, timezone
from email.mime.text import MIMEText
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from rag import chunk_text, embed_chunks, store_embeddings, search_embeddings

load_dotenv()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="."), name="static")

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
SPARK_PRICE_ID = os.getenv("STRIPE_SPARK_PRICE_ID")
BLAZE_PRICE_ID = os.getenv("STRIPE_BLAZE_PRICE_ID")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

PLAN_LIMITS = {
    "free":  50,
    "spark": 500,
    "blaze": None   # unlimited
}

sessions = {}

HIGH_INTENT_KEYWORDS = ["buy", "price", "pricing", "book", "order", "purchase", "call", "contact", "quote"]


# ─── UTILS ───────────────────────────────────────────────────────────────────

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


# ─── CHAT ────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    user_id: str

@app.post("/chat")
async def chat(req: ChatRequest):
    uid = req.user_id
    msg = req.message.strip()

    if uid not in sessions:
        sessions[uid] = {"history": [], "awaiting_contact": False, "last_message": ""}

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

    system_prompt = f"""You are a helpful AI assistant for this business.
Answer ONLY based on the information provided below.
If the answer is not in the context, say: "I don't have that information — let me connect you with the team."
Never guess or make up information.

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
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    obj = event["data"]["object"]

    if event["type"] == "checkout.session.completed":
        metadata = dict(obj).get("metadata") or {}
        user_id = metadata.get("user_id")
        plan = metadata.get("plan", "free")
        customer_id = dict(obj).get("customer")

        if user_id:
            supabase.table("profiles").update({
                "plan": plan,
                "stripe_customer_id": customer_id,
                "subscription_status": "trialing",
                "message_count": 0
            }).eq("id", user_id).execute()

    elif event["type"] == "customer.subscription.updated":
        obj_dict = dict(obj)
        customer_id = obj_dict.get("customer")
        status = obj_dict.get("status")
        price_id = obj["items"]["data"][0]["price"]["id"]
        plan = resolve_plan(price_id)

        supabase.table("profiles").update({
            "plan": plan,
            "subscription_status": status
        }).eq("stripe_customer_id", customer_id).execute()

    elif event["type"] == "customer.subscription.deleted":
        customer_id = dict(obj).get("customer")

        supabase.table("profiles").update({
            "plan": "free",
            "subscription_status": "cancelled"
        }).eq("stripe_customer_id", customer_id).execute()

    return {"status": "ok"}