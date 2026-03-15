# Ori‑Cruit – Phase 2 Features Spec
## Auth & Onboarding · Notifications & Templates · Reporting/Export · Audit Logging

You already know the Ori‑Cruit architecture (Nest/Node backend, PostgreSQL, Flutter client, ES/EN/PL i18n, dark/light theme, multi‑tenant, shared ORI‑OS conventions).  
Do NOT change the core architecture or entities; extend them with the following capabilities.

Implement these as **Phase 2** features, building on top of the existing Ori‑Cruit modules and prompts.

---

## 1. Authentication & User Onboarding

### 1.1 Goals

- Secure, multi‑tenant authentication that maps users to one or more organizations.
- Simple flows for:
  - Sign‑in.
  - Invitation‑based sign‑up (no open public sign‑up).
  - Password reset.
  - Switching between organizations (if a user belongs to more than one).

### 1.2 Data Model (Extend Existing Entities)

Use existing `users`, `organizations`, and `organization_memberships` tables, extending only if necessary:

- `users`
  - id, email (unique), password_hash, full_name, language_preference, last_login_at, created_at, updated_at.
- `organization_memberships`
  - id, user_id, organization_id, role (`OWNER`, `ADMIN`, `RECRUITER`, `LEGAL`, `VIEWER`), invited_by, invited_at, accepted_at.
- Optional new tables:
  - `user_sessions` (if you want server‑side session tracking).
  - `password_reset_tokens`:
    - id, user_id, token (secure random), expires_at, used_at.

### 1.3 Auth Flows

#### 1.3.1 Sign‑In

- Endpoint: `POST /auth/login`
  - Input: email, password.
  - Logic:
    - Verify user by email (case‑insensitive).
    - Compare password with stored hash.
    - On success, create JWT or session with:
      - user_id.
      - primary organization_id (last used or first membership).
      - roles for that org.
    - On failure, return generic error (“Invalid credentials”) without revealing whether email exists.
- Flutter:
  - Simple login form (email + password).
  - Show localized errors.
  - On success, store token/refresh token securely and navigate to Dashboard.

#### 1.3.2 Organization Selection

If user has multiple memberships:

- After login, show an **Organization Picker**:
  - List of orgs with name + logo.
  - User chooses one.
  - The chosen `organization_id` is embedded in the session/context and used for all tenant‑scoped queries.
- Provide a way to change organization from the user menu.

#### 1.3.3 Invitation‑Based Sign‑Up

- Only OWNER/ADMIN can invite.
- Flow:
  - Admin opens Users page under Settings.
  - Clicks “Invite user”.
  - Inputs email, role, language.
  - Backend creates:
    - `users` row if email not already present (without password yet).
    - `organization_memberships` row.
    - `invitation_token` (can be same table as password reset or dedicated).
  - System sends email with invitation link (or logs the link for now).
- Invitation link:
  - Route like `/auth/accept-invite?token=...`.
  - Flutter shows:
    - User info (email, org name).
    - Fields to set full name, password, language.
  - On submit:
    - Validate token, create password hash, mark membership as accepted.

#### 1.3.4 Password Reset

- Endpoint: `POST /auth/request-password-reset`:
  - Input: email.
  - If user exists, create a `password_reset_tokens` record and send email with link (or log token in dev).
- Reset link route: `/auth/reset-password?token=...`.
- Flutter:
  - Show fields for new password and confirmation.
  - Submit to `POST /auth/reset-password`.
- Security:
  - Tokens are single‑use, expire after configurable period (e.g., 1 hour).
  - Never reveal if email exists in the system (“If this email exists, we sent a reset link.”).

---

## 2. Notifications, Message Templates & Scheduled Follow‑Ups

### 2.1 Goals

- Centralize outbound communication:
  - WhatsApp (via provider).
  - Email.
- Use **templates** in ES/EN/PL with placeholders.
- Support **scheduled notifications** for key events:
  - Before arrival.
  - First week follow‑up.
  - After 30 days, etc.

### 2.2 Data Model Enhancements

Use or extend existing tables:

- `message_templates`
  - id, organization_id, code (e.g. `FIRST_CONTACT`, `DOCS_REQUEST`, `ARRIVAL_INSTRUCTIONS`, `FOLLOW_UP_T7`), channel (`WHATSAPP`, `EMAIL`), language (`es`, `en`, `pl`), subject (optional), body (text with placeholders), enabled, created_at, updated_at.
- `messages`
  - id, organization_id, candidate_id, channel, template_code, language, direction (`OUTBOUND`, `INBOUND`), body_rendered, status (`QUEUED`, `SENT`, `DELIVERED`, `FAILED`), provider_message_id, created_at, updated_at.
- `scheduled_notifications`
  - id, organization_id, candidate_id, type (`ARRIVAL_REMINDER`, `FOLLOW_UP_T7`, `FOLLOW_UP_T30`), scheduled_for, channel, template_code, status (`PENDING`, `SENT`, `CANCELLED`, `FAILED`), created_at, updated_at.

### 2.3 Template Management (Settings UI)

In Settings → “Message Templates” (can be a tab or page under Settings):

- List templates grouped by:
  - Use case (contact, docs, legal, payments, arrival, follow‑up).
  - Channel (WhatsApp, Email).
- Allow OWNER/ADMIN to:
  - Create custom templates per org.
  - Edit existing templates (subject/body).
  - Enable/disable templates.
- Body editor:
  - Show list of supported placeholders:
    - `{{candidate_first_name}}`
    - `{{candidate_full_name}}`
    - `{{project_name}}`
    - `{{start_date}}`
    - `{{fee_amount}}`
    - `{{organization_name}}`, etc.
  - Validate that template content is not empty.

### 2.4 Sending Messages from Candidate Detail

From Candidate Detail:

- Global “Send Message” button:
  - Step 1: Choose channel (WhatsApp/email), language.
  - Step 2: Choose template OR “custom message”.
  - Step 3: Preview:
    - Render template with candidate context.
    - Allow small inline edits (e.g., adjusting dates or names).
  - Step 4: Confirm:
    - Create `messages` record.
    - Queue job for worker to actually send via provider.
- Timeline:
  - Show each outbound message as an event.

### 2.5 Scheduled Follow‑Ups

Use the worker/orchestrator layer:

- When certain events occur:
  - `ASSIGNMENT_CONFIRMED`:
    - Schedule `ARRIVAL_REMINDER` for `start_date - 1 day`.
  - `ASSIGNMENT_STARTED`:
    - Schedule `FOLLOW_UP_T7` for `start_date + 7 days`.
    - Schedule `FOLLOW_UP_T30` for `start_date + 30 days`.
- Worker periodically scans `scheduled_notifications` where:
  - `status = PENDING` and `scheduled_for <= now`.
  - Sends messages via templates, updates status (`SENT` or `FAILED`).
- UI:
  - In Candidate Detail → Timeline or a small “Upcoming notifications” section:
    - Show pending notifications and their type/dates.
  - Allow recruiter to cancel a pending notification if not relevant anymore.

---

## 3. Reporting & Export

### 3.1 Goals

- Provide simple, useful reports for operations and management:
  - Pipeline volume by stage/time.
  - Time‑to‑hire and time‑to‑legal approval.
  - No‑shows and reasons.
- Allow export to CSV for external analysis.

### 3.2 Data Model / APIs

No major new tables required; build reporting endpoints that aggregate existing entities:

- `GET /reports/pipeline-summary?from=...&to=...`
  - Returns counts by stage over time.
- `GET /reports/time-to-hire?from=...&to=...`
  - Returns distribution/average of:
    - Time from first contact to legal approval.
    - Time from first contact to assignment start.
- `GET /reports/no-shows?from=...&to=...`
  - Returns list/aggregate by project, recruiter, country.

For exports:

- `GET /reports/export/candidates.csv?filters...`
  - Streams CSV with filtered candidate data.
- `GET /reports/export/assignments.csv?filters...`

All report endpoints must:
- Be tenant‑scoped.
- Enforce role permissions (ADMIN/OWNER by default, possibly RECRUITER limited to their own data).

### 3.3 Reports UI

Create a simple “Reports” section (menu item under main nav or under Settings):

- Tabs like:
  - Overview (high‑level KPIs & charts).
  - Pipeline.
  - Time to hire.
  - No‑shows.
- For each tab:
  - Date filters (from/to, presets).
  - Optional filters: project, recruiter, country.
  - Show:
    - A few cards with key metrics.
    - Simple charts or numerical tables (frontend can compute from API).
  - “Export CSV” button:
    - Calls export endpoints with current filters.

Focus on correctness and clarity; visuals can be basic but readable.

---

## 4. Audit Logging & GDPR Support

### 4.1 Goals

- Track sensitive operations for compliance:
  - Who viewed/edited candidate and document data.
  - Who changed legal decisions, assignments, payments.
- Allow admins to review logs for a given candidate or time period.

### 4.2 Data Model

Use or extend an `audit_log` table:

- `audit_log`
  - id
  - organization_id
  - user_id (nullable if system event)
  - actor_role (optional)
  - event_type (string enum, e.g., `CANDIDATE_VIEWED`, `CANDIDATE_UPDATED`, `DOCUMENT_UPLOADED`, `LEGAL_DECISION`, `PAYMENT_UPDATED`, `EXPORT_PERFORMED`)
  - entity_type (`candidate`, `document`, `assignment`, `payment`, etc.)
  - entity_id
  - metadata (JSON – before/after snapshots or key fields only, not whole objects)
  - ip_address (if available)
  - user_agent (if available)
  - created_at

Keep metadata lean to avoid storing sensitive data twice. Focus on key identifying fields and changed values.

### 4.3 When to Log

Log at least on:

- Candidate operations:
  - View Candidate Detail (maybe at a slightly throttled interval to avoid excessive logging).
  - Update candidate profile.
  - Stage change.
- Document operations:
  - Upload, replace, mark verified, mark invalid.
- Legal operations:
  - Start review, approve, reject, request documents (with reason).
- Payments:
  - Create payment record, mark as paid, cancel.
- Exports:
  - Every call to `/reports/export/...`.

Workers can also log system‑initiated events if helpful.

### 4.4 Audit Log UI

Two entry points:

1. **Per‑Candidate Audit Tab/Section**
   - In Candidate Detail (maybe under Timeline or a separate sub‑tab):
     - Show a filtered view of audit logs for that candidate:
       - Date/time, user, action, short description.
     - Only visible to LEGAL/ADMIN/OWNER roles.

2. **Global Audit Screen (for ADMIN/OWNER)**
   - Filters:
     - Date range.
     - User.
     - Event type.
     - Entity type/id (optional).
   - Table:
     - Time, user, role, event type, entity (type + id), short description.
   - No editing, view‑only.

Implement paging and basic sorting as in other list screens.

---

## 5. Cross‑Cutting Implementation Notes

- Respect multi‑tenant constraints (all new tables must have `organization_id` where relevant).
- All new UI strings must be added to ES/EN/PL localization files.
- Continue using the same theming system for new screens and components.
- For now, you may stub out email/WhatsApp sending with simple logging, as long as the data flow (templates → messages → workers) is correct and can be wired to real providers later.

Follow these specs as the source of truth for Phase 2 features.
