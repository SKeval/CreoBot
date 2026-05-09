import requests
import uuid

BACKEND = "https://creobot-production.up.railway.app"
TEST_USER = str(uuid.uuid4())
HANDOFF_USER = str(uuid.uuid4())
RAG_USER = str(uuid.uuid4())

passed = 0
failed = 0

def test(name, condition, detail=""):
    global passed, failed
    if condition:
        print(f"  ✅ {name}")
        passed += 1
    else:
        print(f"  ❌ {name} {f'— {detail}' if detail else ''}")
        failed += 1

print("\n🤖 CreoBot Test Suite\n")
print(f"  Test users: {TEST_USER[:8]}... / {HANDOFF_USER[:8]}... / {RAG_USER[:8]}...\n")

# ── 1. Health Check ───────────────────────────────────────────────
print("📡 Backend Health")
try:
    r = requests.get(f"{BACKEND}/", timeout=30)
    print(f"  Raw: {r.status_code} — {r.text[:200]}")
    test("Backend is live", r.status_code == 200)
except Exception as e:
    test("Backend is live", False, str(e))

# ── 2. Chat endpoint ─────────────────────────────────────────────
print("\n💬 Chat Endpoint")
try:
    r = requests.post(f"{BACKEND}/chat", json={
        "message": "hello",
        "user_id": TEST_USER
    }, timeout=60)
    print(f"  Raw: {r.status_code} — {r.text[:300]}")
    data = r.json()
    test("Chat returns 200", r.status_code == 200)
    test("Chat has reply field", "reply" in data)
    test("Chat has handoff field", "handoff" in data)
    test("Reply is not empty", len(data.get("reply", "")) > 0)
except Exception as e:
    test("Chat endpoint", False, str(e))

# ── 3. Handoff Trigger ────────────────────────────────────────────
print("\n🤝 Handoff Trigger")
try:
    r = requests.post(f"{BACKEND}/chat", json={
        "message": "I want to buy something",
        "user_id": HANDOFF_USER
    }, timeout=60)
    print(f"  Raw: {r.status_code} — {r.text[:300]}")
    data = r.json()
    test("High intent triggers handoff", data.get("handoff") == True)
    test("Reply asks for contact", "email" in data.get("reply", "").lower() or "phone" in data.get("reply", "").lower())
except Exception as e:
    test("Handoff trigger", False, str(e))

# ── 4. Usage Limit ───────────────────────────────────────────────
print("\n📊 Usage Limit")
try:
    r = requests.post(f"{BACKEND}/chat", json={
        "message": "test message",
        "user_id": str(uuid.uuid4())
    }, timeout=60)
    print(f"  Raw: {r.status_code} — {r.text[:200]}")
    test("Unknown user handled gracefully", r.status_code == 200)
except Exception as e:
    test("Usage limit check", False, str(e))

# ── 5. Upload Endpoint ───────────────────────────────────────────
print("\n📁 Upload Endpoint")
try:
    files = {"file": ("test.txt", b"Our shop opens at 9am and closes at 6pm.", "text/plain")}
    r = requests.post(f"{BACKEND}/upload", files=files,
        data={"user_id": RAG_USER}, timeout=120)
    print(f"  Raw: {r.status_code} — {r.text[:300]}")
    resp = r.json()
    test("Upload returns 200", r.status_code == 200)
    test("Upload successful", resp.get("status") == "uploaded")
    test("Chunks created", resp.get("chunks", 0) > 0)
except Exception as e:
    test("Upload endpoint", False, str(e))

# ── 6. RAG Pipeline ──────────────────────────────────────────────
print("\n🔍 RAG Pipeline")
try:
    r = requests.post(f"{BACKEND}/chat", json={
        "message": "What time do you open?",
        "user_id": RAG_USER
    }, timeout=60)
    print(f"  Raw: {r.status_code} — {r.text[:300]}")
    data = r.json()
    reply = data.get("reply", "").lower()
    test("RAG returns answer", r.status_code == 200)
    test("Answer references uploaded content", "9" in reply or "open" in reply or "9am" in reply)
except Exception as e:
    test("RAG pipeline", False, str(e))

# ── 7. Stripe Subscribe ──────────────────────────────────────────
print("\n💳 Stripe Subscribe")
try:
    r = requests.post(f"{BACKEND}/subscribe", json={
        "user_id": TEST_USER,
        "email": "test@example.com",
        "plan": "spark"
    }, timeout=60)
    print(f"  Raw: {r.status_code} — {r.text[:200]}")
    data = r.json()
    test("Subscribe returns 200", r.status_code == 200)
    test("Returns checkout URL", "checkout_url" in data)
    test("Checkout URL is valid", data.get("checkout_url", "").startswith("https://checkout.stripe.com"))
except Exception as e:
    test("Stripe subscribe", False, str(e))

# ── 8. Webhook ───────────────────────────────────────────────────
print("\n🔔 Webhook")
try:
    r = requests.post(f"{BACKEND}/webhook", json={},
        headers={"stripe-signature": "invalid"}, timeout=30)
    print(f"  Raw: {r.status_code} — {r.text[:200]}")
    test("Webhook rejects invalid signature", r.status_code == 400)
except Exception as e:
    test("Webhook security", False, str(e))

# ── Summary ──────────────────────────────────────────────────────
total = passed + failed
print(f"\n{'='*40}")
print(f"Results: {passed}/{total} passed")
if failed == 0:
    print("🎉 All tests passed!")
else:
    print(f"⚠️  {failed} test(s) failed — check above")
print(f"{'='*40}\n")