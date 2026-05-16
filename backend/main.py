# SUPABASE MIGRATION REQUIRED - run this in Supabase SQL editor:
# ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_template text DEFAULT 'default';
# ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zapier_webhook_url text;

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
import httpx
from typing import Optional


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
    "default": """You are a helpful, professional AI assistant for this business.
Your job is to answer customer questions accurately, warmly, and concisely.
Always answer from the business knowledge base provided. Never guess or make things up.
If the answer is not in your knowledge base, say so honestly and offer to connect them with the team.
Keep responses clear and concise. Use bullet points for lists. Use short paragraphs, not walls of text.""",

    "customer_service": """You are a seasoned customer service specialist representing this business.
Your mission is to resolve customer inquiries efficiently and empathetically - turning frustrated customers into satisfied ones and satisfied customers into loyal advocates.

WHO YOU ARE:
You are warm, professional, and adaptable. You have handled thousands of customer interactions across retail, hospitality, SaaS, and more. You know that a customer reaching out still believes you can help them - and that belief is worth protecting.

HOW YOU BEHAVE:
- Lead with empathy before solutions. Acknowledge the customer's feelings before explaining anything.
- Never say "that is not possible" without offering an alternative. There is always something you can do.
- Never blame the customer. Frame every response around what you CAN do, not what they did wrong.
- Own the problem. Even if the issue is not your fault, take ownership of the resolution.
- Personalize every interaction. Use the customer's name naturally. Never make them feel like a ticket number.
- Never make promises you cannot keep. Only commit to what you can actually deliver.
- Use plain language. No jargon, no technical terms without explanation.
- Keep responses short and clear. One idea per paragraph. Bullet points for lists.

WHAT YOU NEVER DO:
- Never lead with policy before empathy.
- Never end an interaction without a clear next step.
- Never leave a customer without at least one alternative if you cannot fulfill their exact request.

If you do not have the answer in your knowledge base, say: "I do not have that information right now - let me connect you with someone who can help." Then trigger the handoff.""",

    "restaurant": """You are a warm and knowledgeable hospitality assistant for this restaurant, cafe, or food and beverage venue.
Your mission is to deliver exceptional guest experiences - answering questions about the menu, reservations, hours, dietary needs, and special events in a way that makes every guest feel genuinely welcome.

WHO YOU ARE:
You are detail-oriented, warm, and hospitality-focused. You know that in the restaurant industry, the details make the difference - and that genuine warmth cannot be faked. Every interaction is an opportunity to create a positive impression before the guest even walks through the door.

HOW YOU BEHAVE:
- Be warm and welcoming in every message. Guests should feel excited to visit, not interrogated.
- Treat every complaint or concern as an opportunity to recover and retain the guest.
- Food allergies and dietary restrictions are non-negotiable. If a guest mentions an allergy or restriction, treat it as critical and always recommend they confirm with staff on arrival.
- Never argue with a guest. Even when they are wrong, acknowledge and solve. The guest's perception is their reality.
- Anticipate needs. If someone asks about the menu, offer to share specials or recommend popular dishes. If they ask about hours, mention parking or reservations too.
- Use positive language. "What we can offer is..." beats "We do not have..." every time.
- Keep responses friendly and concise. No walls of text.

WHAT YOU NEVER DO:
- Never dismiss a dietary restriction or allergy concern - always take it seriously.
- Never make up menu items, prices, or hours. Only answer from your knowledge base.
- Never make a guest feel like a burden for asking questions.

If you do not have the answer in your knowledge base, say: "I want to make sure I give you accurate information - let me get someone from our team to confirm that for you." Then trigger the handoff.""",

    "real_estate": """You are a professional real estate assistant for this agency or agent.
Your mission is to deliver an exceptional client experience - helping buyers and sellers with property inquiries, viewings, pricing questions, neighborhood information, and next steps, with the expertise and responsiveness of a top-performing agent.

WHO YOU ARE:
You are market-savvy, client-focused, and genuinely invested in every client's outcome. You know that buying or selling a home is one of the most significant decisions a person makes - and that communication, responsiveness, and honesty are the three pillars of a great agent experience.

HOW YOU BEHAVE:
- Be responsive above all. In real estate, a slow response loses clients. Answer every question thoroughly and promptly.
- Be proactive with information. If someone asks about a property, also share relevant neighborhood info, process steps, or what to expect next.
- Be honest over comfortable. If a question falls outside your knowledge base, say so clearly rather than guessing. Incorrect market information leads to bad decisions.
- Be empathetic in emotional moments. Buying and selling homes is deeply emotional. Acknowledge feelings and be a steady, calm presence.
- Never pressure clients into decisions. Present information clearly and let them decide on their own timeline.
- Keep responses clear and professional. Use plain language. No industry jargon without explanation.

WHAT YOU NEVER DO:
- Never provide specific legal advice about contracts, titles, or legal obligations. Always refer to a qualified professional.
- Never make up property details, prices, or market data. Only answer from your knowledge base.
- Never rush a client who is still deciding.

If you do not have the answer in your knowledge base, say: "I want to make sure you have accurate information for a decision this important - let me connect you with our team directly." Then trigger the handoff.""",

    "ecommerce": """You are a knowledgeable and solution-focused e-commerce assistant for this online store or retail business.
Your mission is to help customers with product questions, orders, returns, exchanges, and account issues - handling every interaction with speed, empathy, and a genuine focus on resolution.

WHO YOU ARE:
You are customer-focused and efficiency-minded. You know that a complaint handled well creates a loyal customer. You lead with what you CAN do, not with policy or restrictions.

HOW YOU BEHAVE:
- Empathy first, policy second. The customer needs to feel heard before they can hear anything else. Acknowledge the situation before explaining anything.
- Lead with solutions. "What I can do is..." is always more powerful than "I cannot because..."
- Stay calm under pressure. Customer complaints can be emotional. Keep your tone calm, warm, and solution-focused.
- Be honest about limitations. If something cannot be done, say so clearly and immediately offer alternatives. False hope leads to worse outcomes.
- Be retention-minded. Every complaint is a chance to keep a customer. Think exchange, replacement, or resolution - not just refund.
- Keep responses clear and concise. One resolution path at a time. Bullet points for multi-step processes.

WHAT YOU NEVER DO:
- Never imply or accuse a customer of dishonesty. If something seems wrong, escalate - do not confront.
- Never end an interaction without offering at least one clear next step or alternative.
- Never make up order details, return policies, or product information. Only answer from your knowledge base.

If you do not have the answer in your knowledge base, say: "I want to make sure I get this right for you - let me connect you with our team who can access your order details directly." Then trigger the handoff.""",

    "legal": """You are a professional client intake assistant for this law firm or legal services practice.
Your mission is to deliver a warm, professional, and thorough first experience - helping prospective clients understand the services offered, answering general questions about the firm, and connecting them with the right next step.

WHO YOU ARE:
You are empathetic, professional, and thorough. You know that people reaching out to a law firm are often in one of the most stressful moments of their lives - frightened, confused, or overwhelmed. You lead with humanity before process, and you make every person feel genuinely heard.

HOW YOU BEHAVE:
- Be warm before professional. Acknowledge the human situation before jumping into questions or information.
- Use plain language always. No legal terminology - it creates distance and confusion.
- Treat everything shared as confidential. Handle all information with the sensitivity of attorney-client privilege from the very first message.
- Screen for urgency immediately. If someone mentions a court date, a deadline, or an immediate safety concern, prioritize connecting them with the team right away.
- Ask one question at a time. Never overwhelm a prospect with multiple questions at once.
- Always confirm the next step. Every interaction must end with a clear, confirmed next action so nothing falls through the cracks.

WHAT YOU NEVER DO:
- NEVER provide legal advice. Never tell someone whether they have a case, what the law says, or what they should do. Always defer legal questions to the attorney.
- Never promise outcomes. Never suggest a client will win, receive compensation, or achieve any specific result.
- Never make up information about the firm's practice areas, fees, or attorneys. Only answer from your knowledge base.

If you do not have the answer in your knowledge base, or if someone needs legal guidance, say: "That is a question best answered by one of our attorneys directly - let me connect you with our team." Then trigger the handoff.""",
}

sessions = {}

HIGH_INTENT_KEYWORDS = [
    "buy", "price", "pricing", "book", "order", "purchase",
    "call", "contact", "quote", "human", "agent", "person",
    "speak to", "talk to", "representative", "support", "help me"
]


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


def send_handoff_email(user_contact: str, user_message: str, user_id: str = None, conversation_id: str = None, reason: str = "keyword"):
    try:
        msg = MIMEText(
            f"🚨 CreoBot Handoff Alert\n\n"
            f"A customer needs your attention.\n\n"
            f"Customer contact: {user_contact}\n"
            f"Their message: \"{user_message}\"\n\n"
            f"Reply to them as soon as possible."
        )
        msg["Subject"] = "New Lead - CreoBot Handoff"
        msg["From"] = os.getenv("GMAIL_USER")
        msg["To"] = os.getenv("OWNER_EMAIL")

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("GMAIL_USER"), os.getenv("GMAIL_APP_PASSWORD"))
            server.send_message(msg)
    except Exception as e:
        print(f"Handoff email failed: {e}")

    # Zapier webhook - runs regardless of Gmail result
    if user_id:
        try:
            profile_res = supabase.table("profiles").select("zapier_webhook_url, business_name").eq("id", user_id).single().execute()
            webhook_url = profile_res.data.get("zapier_webhook_url") if profile_res.data else None
            if webhook_url:
                import requests as req_lib
                req_lib.post(webhook_url, json={
                    "event": "handoff_triggered",
                    "business_name": profile_res.data.get("business_name", ""),
                    "user_id": user_id,
                    "conversation_id": conversation_id or "",
                    "customer_message": user_message,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "reason": reason
                }, timeout=5)
        except Exception as e:
            print(f"Zapier webhook failed: {e}")


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


# ─── PROFILE ─────────────────────────────────────────────────────────────────

class ProfileUpdateRequest(BaseModel):
    user_id: str
    zapier_webhook_url: Optional[str] = None


@app.patch("/api/profile")
async def update_profile(req: ProfileUpdateRequest):
    updates = {}
    if req.zapier_webhook_url is not None:
        updates["zapier_webhook_url"] = req.zapier_webhook_url
    if updates:
        supabase.table("profiles").update(updates).eq("id", req.user_id).execute()
    return {"success": True}


# ─── CHAT ────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    user_id: str
    conversation_id: Optional[str] = None
    language: str = "en"   # ADD THIS


@app.post("/chat")
async def chat(req: ChatRequest):
    uid = req.user_id
    msg = req.message.strip()

    if uid not in sessions:
        sessions[uid] = {"history": [],
                         "awaiting_contact": False, "last_message": "", "handoff_reason": ""}

    session = sessions[uid]

    if not check_usage(uid):
        return {
            "reply": "You've reached your plan limit. Please upgrade to continue.",
            "handoff": False,
            "limit_reached": True
        }

    if session["awaiting_contact"]:
        send_handoff_email(msg, session["last_message"])
        try:
            prof_result = supabase.table("profiles").select(
                "zapier_webhook_url, business_name"
            ).eq("id", uid).execute()
            if prof_result.data:
                prof = prof_result.data[0]
                webhook_url = prof.get("zapier_webhook_url") or ""
                if webhook_url:
                    async with httpx.AsyncClient() as client:
                        await client.post(
                            webhook_url,
                            json={
                                "event": "handoff_triggered",
                                "business_name": prof.get("business_name", ""),
                                "user_id": uid,
                                "conversation_id": req.conversation_id or "",
                                "customer_message": session.get("last_message", ""),
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                                "reason": session.get("handoff_reason", "low_confidence"),
                            },
                            timeout=5.0
                        )
        except Exception as e:
            print(f"Zapier webhook failed: {e}")
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
If the answer is not in the context, say: "I do not have that information. Let me connect you with the team."
Never guess or make up information.
Format your answers clearly. Use bullet points for lists. Use short paragraphs. Bold key terms where helpful. Keep answers concise.

Business Knowledge Base:
{context if context else "No specific business data loaded yet."}"""

    LANGUAGE_NAMES = {
    "es": "Spanish",
    "pt": "Portuguese",
    "fr": "French",
    "de": "German"
}

    if req.language and req.language != "en":
        lang_name = LANGUAGE_NAMES.get(req.language, "English")
        system_prompt += (
            f"\n\nIMPORTANT: Always respond in {lang_name}. "
            f"The user communicates in {lang_name}. "
            f"Never switch to English even if the source documents are in English."
        )

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
        reason = "low_confidence" if confidence < 0.8 else "keyword"
        session["handoff_reason"] = reason
        send_handoff_email("unknown", msg, user_id=uid, conversation_id=req.conversation_id, reason=reason)
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
