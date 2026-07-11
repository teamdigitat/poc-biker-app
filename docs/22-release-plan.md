# 22 — Release Plan

## 1. Release Phases

### Phase 0 — Private Beta (Months 0–3)
- **Scope:** Auth, Profile, Garage (basic), Ride Planning (basic), Live Ride Recording, basic Live Tracking share link, SOS + Emergency Contacts, basic Feed/Posts, basic Clubs (join/create, no dues), Admin Panel v0 (moderation + user lookup only).
- **Audience:** 5,000 invited riders across Bengaluru, Pune, Delhi-NCR (seeded via top 50 riding clubs).
- **Exit criteria:** Crash-free session rate > 99%, D7 retention > 15%, at least 500 rides tracked, zero P0 safety incidents unresolved.

### MVP — Public Launch (Months 4–6)
- **Adds:** Crash detection (heuristic v1), geofencing, ETA sharing, Events (RSVP, no ticketing yet), Notifications (push+SMS), Subscriptions v1 (Free/Premium via Razorpay + IAP), Marketplace read-only browse (no transactions yet), full Admin Panel v1.
- **Exit criteria:** 250K registered users, App Store/Play Store rating ≥ 4.3, SOS P50 response < 90s.

### Phase 2 (Months 7–14)
- **Adds:** Stories/Reels, Club Management (roles, dues), Event Ticketing + Payments, Marketplace v1 (transactions live), Fuel/EV/Hotel/Camping directories, ML-based crash detection v2, Gamification (challenges/badges/leaderboards), Learning Platform v1, Wallet, Dealer/Brand Portal v1, Localization (5 languages).
- **Exit criteria:** 2M registered users, 5% paid conversion, marketplace GMV ₹5Cr/month.

### Phase 3 (Months 15–24)
- **Adds:** MotoGP Career Roadmap, AI features (ride summary, trip planner, mechanical assistant), OBD/device integrations, Creator Economy tools, Insurance Claims facilitation, Marketplace v2 (escrow/verification tiers), international pilot.
- **Exit criteria:** 6M+ registered users, category leadership benchmarks met per `02-prd.md` KPIs.

## 2. Release Engineering Process
- **Branching:** trunk-based development with short-lived feature branches; feature flags gate incomplete features in trunk.
- **CI/CD:** GitHub Actions — lint → typecheck → unit tests → integration tests → build → deploy to staging (auto) → deploy to production (manual approval gate).
- **Mobile release:** Expo EAS Build + Submit; staged rollout (10% → 50% → 100%) via Play Store/App Store staged release mechanisms; OTA updates (Expo Updates) for JS-only changes, full store release for native changes.
- **Backend release:** Blue-green deployment behind load balancer; automatic rollback on health-check failure or elevated error rate (Sentry/Prometheus alert-triggered).
- **Database migrations:** backward-compatible, additive-first migrations (expand-contract pattern); no destructive migration ships in the same release as the code that depends on it being complete.

## 3. Environment Strategy

| Environment | Purpose | Data |
|---|---|---|
| Local | Developer machines, Docker Compose | Synthetic/seed data |
| Staging | Pre-prod validation, QA, automated E2E | Sanitized production-like synthetic data |
| Production | Live users | Real data, full monitoring |

## 4. Rollback Plan
- Feature flags allow instant feature disable without deployment.
- Mobile: OTA rollback to previous JS bundle version within minutes; native rollback requires store review (mitigated by staged rollout catching issues at 10%).
- Backend: automated rollback to last known-good container image on failed health checks post-deploy.
- Database: all migrations reviewed for reversibility; destructive changes require a documented manual rollback runbook before merge approval.

## 5. City/Region Rollout Gating
- Feature flags support geo-based rollout (e.g., enable Marketplace transactions city-by-city) to manage supply-side liquidity and support load.
- Rollout sequence for MVP: Bengaluru → Pune → Delhi-NCR → Mumbai/Hyderabad/Chennai (Tier-1) → Tier-2 cities (Phase 2).

## 6. Launch Readiness Checklist (per phase)
- [ ] All Critical/High priority features from `06-features.md` for the phase are Done
- [ ] Security checklist (`17-security.md` §10) signed off
- [ ] Load testing completed at 2x expected peak concurrency
- [ ] Support/CS team trained and support macros prepared
- [ ] App Store/Play Store listing, screenshots, privacy labels updated
- [ ] Rollback runbook reviewed by on-call team
- [ ] Analytics events for new features verified firing correctly in staging
