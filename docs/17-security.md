# 17 — Security

## 1. Authentication & Session Security

- JWT access tokens (short-lived, 15 min) + rotating refresh tokens (30-day, single-use, stored hashed via bcrypt/argon2 in `refresh_tokens`).
- Refresh token rotation: each use issues a new refresh token and invalidates the old one; reuse of a revoked token triggers full session revocation for that user (token theft detection).
- Device session tracking (`devices`, `sessions` tables) — user can view and revoke sessions from Settings.
- Passkey (WebAuthn) support as phishing-resistant alternative to OTP/password.
- Rate limiting on OTP requests (max 5/hour per phone number, Redis-backed sliding window) to prevent SMS bombing/abuse.

## 2. Data Encryption

- **In transit:** TLS 1.3 everywhere (Cloudflare-terminated, re-encrypted to origin via Nginx).
- **At rest:** PostgreSQL disk encryption (cloud provider-managed KMS); sensitive columns (registration_number, medical info, documents) additionally encrypted at the application layer (AES-256-GCM) with keys managed via a secrets manager (not hardcoded, rotated periodically).
- **File storage:** S3-compatible (MinIO) buckets private by default; signed URLs with short expiry for document/photo access.

## 3. Authorization

- RBAC for admin panel (see `16-admin-panel.md`), enforced server-side via NestJS guards, never trusted from client.
- Resource-level authorization checks (e.g., only ride owner or invited participants can view a ride's live location) enforced in service layer, covered by automated tests.
- Club/event moderator permissions scoped per-club (not global), stored in `club_roles`.

## 4. PII & Privacy

- Data minimization: location history retained per user-configurable retention policy (default: full GPS traces downsampled after 90 days, see `11-database-schema.md` `gps_points` lifecycle).
- DPDP Act (India) compliance: explicit consent capture at signup, self-service data export and deletion (`DELETE /auth/account`), grievance officer contact published in-app.
- Medical/emergency info fields are access-restricted — visible only to the user themselves and, during an active SOS event, to notified emergency contacts (time-boxed access).
- Minors (13–17): restricted feature set (no public marketplace selling, no direct messaging with unconnected adults by default, parental consent required for SOS/location sharing setup).

## 5. Application Security

- Input validation via class-validator DTOs on every NestJS endpoint; centralized exception filter to avoid leaking stack traces in production.
- SQL injection mitigated via Drizzle ORM parameterized queries (no raw string concatenation).
- Rate limiting (Redis token bucket) on all public/write endpoints; stricter limits on SOS-adjacent and payment endpoints to prevent abuse while never blocking a legitimate SOS trigger (SOS endpoint uses a generous, safety-first limit).
- CSRF protection on admin panel (SameSite cookies + CSRF tokens); mobile app uses bearer tokens (not cookie-based, CSRF N/A).
- Dependency scanning (GitHub Dependabot/Snyk) in CI pipeline; blocked merge on critical CVEs.
- OWASP ASVS-aligned security review checklist required before each major release.

## 6. Infrastructure Security

- Docker images built from minimal base images (distroless/alpine), scanned in CI.
- Secrets managed via environment injection from a secrets manager (never committed to repo; `.env` files gitignored, `.env.example` provided).
- Network segmentation: database and Redis not publicly accessible; only backend service subnet has access.
- Cloudflare WAF + DDoS protection in front of all public endpoints.
- Prometheus/Grafana alerting on anomalous traffic patterns; Sentry for error tracking with PII scrubbing on captured events.

## 7. Payment Security

- No raw card data touches Riding Verse servers — handled entirely via Razorpay/Stripe/Apple/Google tokenized flows (PCI-DSS scope minimized to SAQ-A).
- Webhook signature verification mandatory for all payment provider webhooks before processing.
- Idempotency keys on all payment-mutating endpoints to prevent double-charging on retry.

## 8. Safety-Feature-Specific Security Considerations

- Live-tracking share links use cryptographically random, unguessable tokens (`share_token`, 64+ chars) with mandatory expiry — never sequential/predictable IDs.
- SOS/crash data given elevated availability priority: separate queue, separate worker pool, so a broader system incident doesn't degrade the safety path.
- Location data shared with emergency contacts is access-logged and automatically revoked after the ride/SOS event resolves (time-boxed, not indefinite access).

## 9. Incident Response

- On-call rotation (PagerDuty-style) for P0/P1 incidents, with SOS/crash-detection outages treated as P0 regardless of overall user impact size.
- Documented incident response runbook: detect (Sentry/Prometheus alert) → triage → mitigate → root-cause postmortem within 5 business days for P0/P1.
- Responsible disclosure program (security.txt, bug bounty consideration at scale) for external researchers.

## 10. Compliance Checklist (Pre-Launch)

- [ ] DPDP Act data processing agreement & privacy policy published
- [ ] Terms of Service reviewed by legal counsel (India-specific)
- [ ] Age-gating and parental consent flow tested end-to-end
- [ ] Penetration test completed on auth, payments, and SOS flows
- [ ] Data retention/deletion jobs verified in staging
- [ ] App Store/Play Store privacy nutrition labels accurately reflect data collection
