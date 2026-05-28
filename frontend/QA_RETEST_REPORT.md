# CreoBot QA Re-test Report
**Date:** 2026-05-28  
**Tester:** Claude (Cowork)  
**Base URL:** http://localhost:3000  
**Re-testing:** 9 bugs from QA_REPORT_PORT3000.md

---

## Re-test Summary

| Original Bug | Severity | Status |
|---|---|---|
| #1 — `/onboarding` no auth guard | HIGH | ✅ FIXED |
| #2 — Framer Motion black flash (navbar) | LOW | ❌ Still open |
| #3 — Language switcher missing on `/blog` + `/for/home-services` | MEDIUM | ✅ FIXED |
| #4 — Pricing CTA buttons hardcoded in English | MEDIUM | ✅ FIXED |
| #5 — "Trust & Privacy" link missing from `/pricing` footer | MEDIUM | ✅ FIXED |
| #6 — Comparison table no scroll affordance at mobile | MEDIUM | ✅ FIXED |
| #7 — WhatsApp row missing from comparison table | LOW | ✅ FIXED |
| #8 — Dead code: `p.cta` computed but never rendered | LOW | ✅ FIXED |
| #9 — Framer flash on all animated pages (same root cause as #2) | LOW | ❌ Still open |

**7 of 9 bugs fixed. 1 Low severity remains open.**

---

## Bug-by-Bug Details

### ✅ #1 — `/onboarding` Auth Guard (HIGH → FIXED)
Navigating to `/onboarding` while logged out now redirects immediately to `/login`. All three test tabs confirmed the redirect. 

### ❌ #2/#9 — Framer Motion Initial Opacity Flash (LOW → Still Open)
The navbar (`creobot-navbar.tsx` line 43) still uses `initial={{ opacity: 0, y: -16 }}`, causing a brief dark screen on first page load. Same pattern present in `HomepageClient.tsx`, `BlogPageClient.tsx`, `PricingClient.tsx`, and all other animated pages. To fix: either remove the `initial` prop (default is already visible) or set `initial={{ opacity: 1, y: 0 }}` and only animate secondary elements.

### ✅ #3 — Language Switcher on Blog / Home-services (MEDIUM → FIXED)
`document.querySelector('header select')` returns the EN/ES/PT/FR/DE select element on both `/blog` and `/for/home-services`. The `langSwitcher` prop is now passed to `CreoBotNavbar` on all pages.

### ✅ #4 — Pricing CTA Buttons Not Translated (MEDIUM → FIXED)
Plan card CTA links now use i18n keys. Verified in German (DE):
- "Start free" → "Kostenlos starten" ✓  
- "Start free - 14 day trial" → "Kostenlos starten - 14 Tage testen" ✓  
- Feature items: "E-Mail-Support", "14 Tage kostenlos testen", "Unbegrenzt" all translate ✓  
- CTAs now use `t('pricing.pricing_cta_upgrade')`, `t('pricing.pricing_cta_trial')` etc. in the JSX ✓

**Minor new finding (Low):** German translation for "Priority support" renders as "Prioritatssupport" — missing ä umlaut (should be "Prioritätssupport"). Recommend fixing in `src/lib/i18n.ts`.

### ✅ #5 — "Trust & Privacy" Missing from `/pricing` Footer (MEDIUM → FIXED)
Footer text on `/pricing` now includes "Trust & Privacy" link. Confirmed via `document.querySelector('footer').innerText`.

### ✅ #6 — Comparison Table No Scroll Affordance (MEDIUM → FIXED)
A gradient fade overlay (`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradi...`) has been added as a sibling to the `overflow-x-auto` wrapper. This visually signals to mobile users that the table is horizontally scrollable.

### ✅ #7 — WhatsApp Row Missing from Comparison Table (LOW → FIXED)
"WhatsApp" text now present in the comparison table. Confirmed via `tableText.includes('whatsapp')` returning `true`.

### ✅ #8 — Dead Code `p.cta` (LOW → FIXED)
`p.cta` field no longer exists in the pricing data structure. CTA text is now rendered directly inline using `t('pricing.pricing_cta_*')` keys. Dead code removed.

---

## New Finding

| # | PAGE | ISSUE | SEVERITY |
|---|------|-------|----------|
| 10 | `/pricing` (DE) | "Prioritatssupport" missing ä umlaut — should be "Prioritätssupport" in `i18n.ts` | LOW |

---

## Remaining Open Issues

| # | PAGE | ISSUE | SEVERITY |
|---|------|-------|----------|
| 2/9 | All animated pages | Framer Motion `initial={{ opacity: 0 }}` causes ~300ms dark flash on page load | LOW |
| 10 | `/pricing` (DE) | "Prioritatssupport" typo in German translation | LOW |
