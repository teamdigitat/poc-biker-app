# 15 — Subscription Plans

## 1. Tier Overview

| Tier | Target Persona | Monthly Price (₹) | Annual Price (₹) |
|---|---|---|---|
| Free | All new users | 0 | 0 |
| Premium | Regular riders wanting more tracking/navigation | 149 | 1,299 |
| Premium+ | Power users, tourers, track riders | 349 | 2,999 |
| Family | Households wanting shared safety features | 399 | 3,499 |
| Club | Riding clubs (organization-level) | 999 (up to 100 members) | 9,999 |

## 2. Feature Matrix

| Feature | Free | Premium | Premium+ | Family | Club |
|---|---|---|---|---|---|
| Ride tracking (count/month) | 10 rides | Unlimited | Unlimited | Unlimited | Unlimited |
| Ride history retention | 90 days | Unlimited | Unlimited | Unlimited | Unlimited |
| Live location sharing | Basic (1 contact) | Up to 5 contacts | Unlimited contacts | Unlimited, shared across family | Unlimited |
| Crash detection | Yes (core safety, always free) | Yes | Yes | Yes | Yes |
| SOS & emergency contacts | Yes (core safety, always free) | Yes | Yes | Yes | Yes |
| Offline maps | 1 region | 5 regions | Unlimited regions | Unlimited (shared) | Unlimited |
| Ad-free experience | No | Yes | Yes | Yes | Yes |
| Advanced ride stats/analytics | No | Basic | Advanced (heatmaps, trends) | Advanced | Advanced |
| Route planner (multi-day) | 1 active plan | 5 active plans | Unlimited | Unlimited | Unlimited |
| AI credits/month (summaries, trip planner, assistant) | 3 | 25 | 100 | 100 shared | 250 |
| Priority customer support | No | No | Yes | Yes | Yes |
| Exclusive events access | No | No | Yes (early access) | Yes | Yes (club-hosted priority listing) |
| Marketplace listing boost | No | 1 free/month | 3 free/month | 3 free/month (shared) | 10 free/month |
| Cloud storage (photos/videos) | 1 GB | 10 GB | 50 GB | 50 GB shared | 100 GB |
| Family member slots | — | — | — | Up to 5 | — |
| Club member management tools | — | — | — | — | Yes (up to 100; scales with add-on) |
| Club event ticketing fee discount | — | — | — | — | Reduced platform fee (5% vs 8%) |
| Verified badge eligibility | Manual review | Manual review | Priority review | — | Club verification included |

## 3. Billing & Payment Integration
- **India (default):** Razorpay (UPI, cards, netbanking, wallets) for web/direct billing where app-store policy allows (e.g., club/business web portal); Google Play Billing / Apple IAP mandatory for in-app mobile subscription purchases per store policy.
- **International (future):** Stripe.
- Proration handled on upgrade/downgrade; annual plans offer ~2 months free equivalent discount.
- Grace period of 3 days on payment failure before downgrade to Free tier; retry logic via provider webhooks (BullMQ retry job on `payment.failed` webhook).

## 4. Free-to-Paid Conversion Triggers (In-App)
- Ride #11 in a month (Free tier limit reached) → contextual upgrade prompt.
- Attempting to add a 2nd emergency contact beyond Free limit.
- Attempting to download a 2nd offline map region.
- Viewing an "Exclusive Event" with a Premium+ lock badge.
- AI credits exhausted mid-month.

## 5. Family Plan Details
- Plan owner invites up to 4 additional members via phone number/link.
- Shared benefits: pooled AI credits, pooled cloud storage, cross-visibility of live-tracking for family members riding (opt-in per ride).
- Family Safety Dashboard (web + app): view family members' last-known location and ride status at a glance (subject to per-member sharing consent).

## 6. Club Plan Details
- Base tier covers up to 100 members; add-on packs of 100 members at ₹499/month each.
- Includes: club verification badge, custom club page branding, member role management, dues collection, reduced marketplace/ticketing platform fees.

## 7. Cancellation & Downgrade Policy
- Self-service cancellation any time; access continues until end of current billing period.
- Downgrade to Free retains ride history (read-only beyond retention cap) but restricts new usage per Free-tier limits.
- Data (ride history, garage, documents) is never deleted on downgrade — only feature access is limited (revenue-safe, trust-preserving policy).

## 8. Cross-reference
Full monetization strategy (marketplace commission, ads, affiliate, etc. beyond subscriptions) is documented in `21-monetization.md`.
