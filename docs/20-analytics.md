# 20 — Analytics

## 1. Analytics Architecture

- Client-side event tracking (React Native) → batched dispatch → `POST /analytics/events` → written to `analytics_events` (raw log) → streamed/batched into a data warehouse (e.g., ClickHouse or BigQuery-equivalent, Phase 2+) for BI.
- Real-time operational metrics (SOS events, active rides, error rates) via Prometheus/Grafana, separate from product analytics.
- Aggregations precomputed into `aggregated_stats` for fast dashboard reads (daily/weekly cron via BullMQ scheduled jobs).

## 2. Core Event Taxonomy

| Category        | Example Events                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Lifecycle       | `app_opened`, `app_backgrounded`, `session_started`, `session_ended`                             |
| Auth            | `signup_started`, `otp_verified`, `login_success`, `login_failed`                                |
| Onboarding      | `onboarding_step_completed`, `motorcycle_selected`, `interests_selected`                         |
| Garage          | `motorcycle_added`, `maintenance_logged`, `document_uploaded`                                    |
| Ride            | `ride_started`, `ride_paused`, `ride_stopped`, `ride_shared`                                     |
| Safety          | `sos_triggered`, `sos_cancelled`, `crash_detected`, `crash_confirmed`, `emergency_contact_added` |
| Community       | `post_created`, `post_liked`, `comment_added`, `story_created`, `reel_created`                   |
| Clubs/Events    | `club_joined`, `event_created`, `event_rsvp`, `ticket_purchased`                                 |
| Marketplace     | `listing_created`, `listing_viewed`, `order_placed`, `review_submitted`                          |
| Monetization    | `subscription_started`, `subscription_cancelled`, `wallet_topped_up`, `coupon_applied`           |
| Learning/Career | `course_enrolled`, `lesson_completed`, `certificate_earned`, `roadmap_milestone_completed`       |
| Notifications   | `notification_sent`, `notification_opened`                                                       |

## 3. Key Dashboards

### 3.1 Executive Dashboard (Admin)

- DAU/WAU/MAU, new signups, D1/D7/D30 retention cohorts, revenue (subscriptions + marketplace GMV), safety incident counts (SOS/crash) with response-time SLAs.

### 3.2 Safety Operations Dashboard

- Real-time SOS/crash event map, time-to-contact-notification, false-positive rate trend (crash detection model health), unresolved SOS events aging report.

### 3.3 Growth Dashboard

- Funnel: install → OTP verified → profile complete → first ride tracked → D7 retained.
- Channel attribution (organic vs. paid vs. referral vs. club-driven).

### 3.4 Community Health Dashboard

- Posts/comments per DAU, moderation queue volume & resolution time, club growth rate, event fill rate.

### 3.5 Marketplace Dashboard

- GMV, take rate realized, listing-to-order conversion rate, seller verification funnel, dispute/report rate.

### 3.6 Business/Brand Analytics (Business Portal)

- Campaign impressions, CTR, conversion, audience demographics (aggregated/anonymized), spend vs. budget.

## 4. Cohort & Retention Analysis

- Standard cohort retention curves (D1/D7/D30/D90) segmented by: acquisition channel, persona/interest tags, city tier (metro vs. non-metro), subscription tier.
- Special cohort: "Safety feature adopters" (configured ≥1 emergency contact within first session) tracked separately — hypothesis: this cohort retains significantly better; validate via dashboard from MVP launch.

## 5. Experimentation Framework

- Feature-flag-driven A/B testing (via `feature_flags` table + rollout percentage) for onboarding flow variants, paywall placement, notification frequency tuning.
- Statistical significance thresholds and minimum sample size guardrails defined per experiment before rollout to avoid premature conclusions.

## 6. Data Privacy in Analytics

- All analytics events are pseudonymized where possible (hashed user IDs for third-party analytics tools, if any are added).
- Location-derived analytics (e.g., popular routes) aggregated/anonymized at the segment level before any external reporting or business-partner sharing — individual rider routes are never sold or shared with third parties.

## 7. Reporting Cadence

- Daily automated Slack/email digest to product/leadership: key metrics snapshot + anomaly flags.
- Weekly deep-dive review (growth, safety, community, monetization) with module owners.
- Monthly board-level report aligned to KPIs defined in `02-prd.md`.
