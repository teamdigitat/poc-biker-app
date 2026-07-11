# 16 — Admin Panel

The admin panel is a separate web application (React + TypeScript, not React Native), served at `admin.ridingverse.com`, using the same NestJS backend via admin-scoped, RBAC-protected API routes (`/admin/*`).

## 1. Roles & Permissions (RBAC)

| Role | Access Scope |
|---|---|
| Super Admin | Full access, including RBAC management, feature flags, financial data |
| Moderator | Content moderation queue, user reports, warn/ban actions |
| Support Agent | Support tickets, read-only user lookup, refund initiation (approval-gated) |
| Business Manager | Dealer/brand portal oversight, ad campaign approvals |
| Content Manager (CMS) | CMS content blocks, banners, featured content curation |
| Finance | Transactions, payouts, subscription/billing reports (read + reconciliation actions) |
| Analyst | Read-only analytics dashboards |

## 2. Admin Screen Inventory (25 Screens)

| ID | Route | Purpose |
|---|---|---|
| SCR-ADM-001 | /admin/login | Admin login (email/password + 2FA mandatory) |
| SCR-ADM-002 | /admin/dashboard | Overview KPIs (DAU/MAU, revenue, safety incidents) |
| SCR-ADM-003 | /admin/users | User search/list |
| SCR-ADM-004 | /admin/users/:id | User detail (profile, rides, subscription, flags) |
| SCR-ADM-005 | /admin/users/:id/suspend | Suspend/ban action modal |
| SCR-ADM-006 | /admin/users/:id/audit-log | Per-user audit trail |
| SCR-ADM-007 | /admin/content | Content browser (posts/reels/stories) |
| SCR-ADM-008 | /admin/content/:id | Content detail/action panel |
| SCR-ADM-009 | /admin/reports | Report inbox (user-submitted reports) |
| SCR-ADM-010 | /admin/moderation | Moderation queue (see A8 in `08-screen-flow.md`) |
| SCR-ADM-011 | /admin/safety/sos-monitor | Live SOS event monitor (real-time dashboard) |
| SCR-ADM-012 | /admin/safety/crash-events | Crash event review/ML feedback tool |
| SCR-ADM-013 | /admin/clubs | Club directory/verification management |
| SCR-ADM-014 | /admin/clubs/:id/verify | Club verification review |
| SCR-ADM-015 | /admin/events | Event oversight (flagged/reported events) |
| SCR-ADM-016 | /admin/marketplace/listings | Listing moderation queue |
| SCR-ADM-017 | /admin/marketplace/sellers | Seller verification queue |
| SCR-ADM-018 | /admin/business | Dealer/brand account management |
| SCR-ADM-019 | /admin/business/:id/campaigns | Ad campaign approval |
| SCR-ADM-020 | /admin/cms | CMS content editor |
| SCR-ADM-021 | /admin/feature-flags | Feature flag management |
| SCR-ADM-022 | /admin/analytics | Analytics dashboards (drill-down) |
| SCR-ADM-023 | /admin/finance | Transactions, payouts, reconciliation |
| SCR-ADM-024 | /admin/support | Support ticket queue |
| SCR-ADM-025 | /admin/roles | RBAC role/permission management |

## 3. Key Admin Workflows

### 3.1 Moderation Workflow
1. Report or automated flag creates a `moderation_reports` row.
2. Appears in queue, prioritized by severity (safety/harassment > spam > misc).
3. Moderator reviews content preview, selects action (Approve/Remove/Warn/Ban/Escalate) with mandatory reason code.
4. Action logged in `moderation_actions`; audit log entry created; user notified if applicable.
5. Escalated items route to Super Admin for final review (e.g., legal/safety-sensitive cases).

### 3.2 SOS/Crash Live Monitor
- Real-time dashboard (Socket.IO feed) showing active SOS events across the platform, with location on a map, time since trigger, and contact-notification status.
- Purpose: enables a human safety-ops team (Phase 2+) to intervene (e.g., call local authorities) if automated contact notification doesn't resolve within an SLA window (e.g., 5 minutes).

### 3.3 Club/Seller Verification
- Verification request queue with submitted documents (club registration proof / seller ID proof).
- Reviewer approves/rejects with notes; approved entities get `is_verified = true` and badge.

## 4. Admin Panel Non-Functional Requirements
- Mandatory 2FA for all admin accounts.
- IP allowlisting option for Super Admin/Finance roles.
- All admin actions are audit-logged with immutable log storage (append-only table, exported to cold storage periodically).
- Session timeout: 30 minutes of inactivity for admin panel (stricter than mobile app).

## 5. Tech Stack Note
- Admin panel: React + TypeScript + Vite, TanStack Query, shadcn/ui-style components, deployed independently (Docker container) behind Cloudflare + Nginx, same auth system but with separate `admin_users` table and stricter session rules.
