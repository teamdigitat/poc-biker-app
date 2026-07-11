# 02 — Product Requirements Document (PRD)

## 1. Vision
See `01-product-vision.md`. Riding Verse is India's motorcycle super-app: community + safety + navigation + learning + commerce, built mobile-first for 50M+ users at scale.

## 2. Problem Statement
Motorcyclists in India today must juggle 8–10 disconnected tools to do what should be one coherent experience:
- WhatsApp/Telegram for club coordination (no structure, no discovery, chat gets lost)
- Google Maps for navigation (not motorcycle-aware: no curve/road-quality data, no group ride sharing)
- Instagram/YouTube for riding content (no ride-specific tools, no safety features)
- Life360/Garmin (foreign, expensive, not India-optimized, no community layer)
- Local WhatsApp groups or Facebook Groups for events (no ticketing, no verified organizers)
- OLX/Facebook Marketplace for used bikes and gear (no trust layer, no rider-specific context)
- No unified path exists from "I want to try track riding" to "I want to race professionally."

**Core pain points:**
1. No reliable way to share live location with family during rides through bad-network areas.
2. No automated crash detection or SOS specifically tuned for motorcycles (different crash signatures than cars).
3. Club and event discovery is informal, unverified, and fragmented across cities.
4. No single source of truth for "which mechanic/fuel stop/hotel is rider-friendly here."
5. No structured, affordable pathway from street riding to competitive racing in India.
6. Female riders lack dedicated safety and community features.
7. Riders can't easily track bike maintenance, expenses, or documents (RC, insurance, PUC) tied to actual usage/mileage.

## 3. Target Audience
See `03-user-personas.md`. Primary MVP focus (India, Year 1): Casual/weekend riders, tourers, RE/KTM owners, riding clubs & organizers, female riders. Secondary (Year 2+): Track riders, MotoGP aspirants, delivery riders, brands/dealers, racing academies.

## 4. Business Goals
- Become the #1 motorcycle community app in India by MAU within 24 months of launch.
- Build a defensible safety moat (crash detection + SOS) that drives organic, word-of-mouth (especially via families of riders).
- Establish a multi-sided marketplace generating transaction revenue within 12 months of MVP launch.
- Create the definitive digital pathway for motorsport careers in India, becoming the discovery layer academies and sponsors use.

## 5. Revenue Model (summary — full detail in `21-monetization.md`)
- Freemium subscriptions (Premium, Premium+, Family, Club)
- Marketplace commission (accessories, used bikes, services)
- Ride Pass / event ticketing fees
- Affiliate commissions (insurance, travel, hotels, gear)
- Brand/sponsor advertising and sponsored events
- Training/certification course fees
- API/platform licensing (Phase 3+)

## 6. Success Metrics & KPIs

| Category | Metric | MVP Target (Month 6) | Year 1 Target | Year 3 Target |
|---|---|---|---|---|
| Growth | Registered users | 250,000 | 2,000,000 | 15,000,000 |
| Engagement | MAU/Registered ratio | 35% | 45% | 55% |
| Engagement | Rides tracked/month/active user | 1.5 | 3 | 5 |
| Safety | SOS response time (P50) | < 90s | < 60s | < 30s |
| Safety | Crash-detection accuracy (true positive) | 80% | 90% | 95% |
| Community | Active clubs on platform | 500 | 5,000 | 50,000 |
| Community | Posts/comments per DAU | 2 | 4 | 6 |
| Monetization | Paid conversion (Premium) | 2% | 5% | 10% |
| Monetization | Marketplace GMV/month | ₹50L | ₹5Cr | ₹100Cr |
| Retention | D30 retention | 20% | 30% | 40% |
| Performance | Crash-free session rate | 99.5% | 99.7% | 99.9% |
| Performance | App cold start (P90) | < 2.5s | < 2s | < 1.5s |

## 7. Competition
Full analysis in `18-future-features.md` / competitor section. Summary: no single competitor combines safety + navigation + community + marketplace + motorsport pathway for the Indian two-wheeler context. Closest analogues (REVER, Calimoto, RE App, Life360, Strava) each cover 1–2 of these pillars, are not India-optimized, and lack a motorsport career layer.

## 8. Functional Requirements (Summary; full detail in `06-features.md`)
1. Authentication: Phone OTP, Google, Apple, Email, Passkeys, device/session management.
2. Profile & Garage: rider profile, motorcycle garage, documents, maintenance tracking.
3. Ride Planning & Navigation: route planning, GPX import/export, offline maps, group rides.
4. Live Tracking & Safety: live location sharing, crash detection, SOS, emergency contacts, geofencing.
5. Community: feed, stories, reels, groups, clubs, events, messaging.
6. Marketplace: accessories, used bikes, services, mechanics, fuel/EV stations, hotels/camping.
7. Gamification: challenges, achievements, badges, leaderboards.
8. Learning & Motorsport: courses, certifications, MotoGP career roadmap, academies, race results.
9. Subscriptions & Payments: tiered plans, wallet, Razorpay/Stripe/UPI/IAP.
10. Admin & Business Tools: CMS, moderation, CRM, dealer/brand portals, analytics.
11. AI: ride summaries, trip planner, mechanical assistant, road safety tips.

## 9. Non-Functional Requirements

### 9.1 Performance
- API P95 latency < 300ms for read endpoints, < 600ms for write endpoints under nominal load.
- Live tracking location updates delivered to viewers within 3 seconds (via Socket.IO) under good network; degrade gracefully under poor network with local buffering.
- Push notification delivery P95 < 10s.

### 9.2 Scalability
- Stateless NestJS services behind load balancers; horizontal autoscaling.
- PostgreSQL with read replicas; partitioning for high-volume tables (GPS points, notifications, transactions).
- Redis for caching, session state, and rate limiting; BullMQ/RabbitMQ for async workloads (notification fan-out, media processing, AI summarization).
- Target architecture supports 50M registered users, 5M concurrent DAU peak, 500K concurrent live-tracking sessions.

### 9.3 Offline Support
- Mobile app must support: viewing garage/profile, planning routes (cached maps), recording a ride (GPS points buffered locally in SQLite/WatermelonDB), and viewing previously loaded feed/community content, all without network.
- Sync-on-reconnect conflict resolution: last-write-wins for simple profile fields; append-only merge for ride GPS points and ride logs.
- Offline maps downloadable per-region (state/city) with expiry and storage management.

### 9.4 Accessibility
- WCAG 2.1 AA target for text contrast, font scaling, and touch target sizes (min 44x44dp).
- Full screen-reader support (TalkBack/VoiceOver) for all critical flows: auth, SOS, ride start/stop.
- Support for Indian regional languages (Hindi, Marathi, Tamil, Telugu, Kannada, Bengali) from MVP; expandable localization framework (see `06-features.md` Localization module).
- Large-text/one-handed "ride mode" UI for use while riding (glove-friendly targets, high contrast for sunlight).

### 9.5 Security & Privacy
Full detail in `17-security.md`. Summary: encryption at rest/in transit, JWT access/refresh token rotation, device session management, RBAC for admin, PII minimization, location data retention policy, GDPR-style data export/delete for future EU expansion, DPDP Act (India) compliance.

### 9.6 Reliability
- 99.9% uptime SLA target for core API (auth, live tracking, SOS) by Year 1.
- SOS/crash-detection path has an independent, higher-priority infrastructure lane (dedicated queue priority, redundant delivery via push + SMS).

## 10. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| False crash-detection alerts erode trust | High | High | Multi-signal detection (accel + gyro + speed drop + rider confirmation countdown), continuous ML tuning, easy false-alarm cancellation |
| Poor network in rural/highway areas breaks live tracking | High | High | Offline-first buffering, SMS-based fallback for last-known-location, periodic sync |
| Low initial club/organizer supply (chicken-and-egg) | High | Medium | Manual onboarding of top 500 clubs pre-launch, city-by-city seeding strategy |
| Marketplace trust/fraud (used bikes, sellers) | Medium | High | Verified seller badges, escrow-style payment option, report/moderation pipeline |
| Regulatory risk around location data & minors | Medium | High | Strict age-gating (13+/18+ per feature), DPDP Act compliance, parental consent flows for under-18 |
| Motorsport career claims perceived as misleading | Low | Medium | Clear disclaimers, partnership with real academies (MMSC-affiliated), transparent cost estimates |
| High infra cost from live tracking + push at scale | Medium | Medium | Tiered update frequency by plan, aggressive Redis caching, connection pooling, adaptive GPS sampling |
| App store policy risk (IAP for subscriptions) | Medium | Medium | Strict adherence to Apple/Google IAP policy for digital subscriptions from day one |

## 11. Launch Plan (summary — full detail in `22-release-plan.md`)
- **Phase 0 (Private Beta):** 5,000 riders, 3 cities (Bengaluru, Pune, Delhi-NCR), core auth+profile+garage+ride tracking+basic community.
- **MVP (Public Launch):** Add live tracking, SOS, clubs/events, marketplace v1, subscriptions.
- **Phase 2:** Learning platform, MotoGP career roadmap, advanced gamification, dealer/brand portals.
- **Phase 3:** AI features at scale, wearable/OBD integrations, international expansion pilot.

## 12. Module List
See `07-modules.md` for the full module breakdown and `06-features.md` for the feature-level table.
