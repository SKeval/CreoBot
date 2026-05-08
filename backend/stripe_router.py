import stripe
import os
from fastapi import APIRouter, Request, HTTPException, Header
from supabase import create_client

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

PLAN_LIMITS = {
    "free": 50,
    "spark": 500,
    "blaze": None  # unlimited
}

# ── Create Checkout Session ──────────────────────────────────────────
@router.post("/stripe/create-checkout")
async def create_checkout(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    price_id = body.get("price_id")
    email = body.get("email")

    if not all([user_id, price_id, email]):
        raise HTTPException(status_code=400, detail="Missing fields")

    session = stripe.checkout.Session.create(
        customer_email=email,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        subscription_data={"trial_period_days": 14},
        success_url="http://localhost:3000/dashboard?upgrade=success",
        cancel_url="http://localhost:3000/dashboard?upgrade=cancelled",
        metadata={"user_id": user_id}
    )

    return {"url": session.url}


# ── Webhook ──────────────────────────────────────────────────────────
@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, WEBHOOK_SECRET)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    data = event["data"]["object"]

    if event["type"] == "checkout.session.completed":
        user_id = data["metadata"]["user_id"]
        customer_id = data["customer"]
        supabase.table("profiles").update({
            "stripe_customer_id": customer_id,
            "subscription_status": "trialing"
        }).eq("id", user_id).execute()

    elif event["type"] == "customer.subscription.updated":
        customer_id = data["customer"]
        status = data["status"]
        plan = _resolve_plan(data)
        supabase.table("profiles").update({
            "plan": plan,
            "subscription_status": status
        }).eq("stripe_customer_id", customer_id).execute()

    elif event["type"] == "customer.subscription.deleted":
        customer_id = data["customer"]
        supabase.table("profiles").update({
            "plan": "free",
            "subscription_status": "cancelled"
        }).eq("stripe_customer_id", customer_id).execute()

    return {"status": "ok"}


# ── Usage Check (called from main.py before answering) ───────────────
def check_usage_limit(user_id: str) -> bool:
    """Returns True if user can still send messages."""
    from datetime import datetime, timezone

    result = supabase.table("profiles").select(
        "plan, message_count, trial_ends_at, subscription_status"
    ).eq("id", user_id).single().execute()

    profile = result.data
    if not profile:
        return False

    # Trial still active → unlimited
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


def increment_message_count(user_id: str):
    supabase.rpc("increment_message_count", {"uid": user_id}).execute()


def _resolve_plan(subscription_data: dict) -> str:
    spark_price = os.getenv("STRIPE_SPARK_PRICE_ID")
    blaze_price = os.getenv("STRIPE_BLAZE_PRICE_ID")
    price_id = subscription_data["items"]["data"][0]["price"]["id"]
    if price_id == spark_price:
        return "spark"
    elif price_id == blaze_price:
        return "blaze"
    return "free"