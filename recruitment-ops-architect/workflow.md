# Ori‑Cruit – Detailed UI/UX Spec for Core Screens

You already know the global architecture (Nest/Node backend, PostgreSQL, Flutter client, ES/EN/PL i18n, dark/light theme, multi‑tenant).  
Do NOT change the architecture, entities or routing; implement these screens on top of the existing Ori‑Cruit data model and services.

Implement the following screens with the same conventions as the existing Dashboard spec:

1. Candidate Pipeline
2. Candidate Detail
3. Legal Review Queue
4. Settings / Organization / Integrations

Use the existing state management pattern (Riverpod/BLoC/Provider) and folder structure.

---

## 1. Candidate Pipeline Screen

**Route example:** `/pipeline`

### 1.1 Purpose

The Candidate Pipeline screen is the main operational view for recruiters. It shows a **filterable, paginated table/list of candidates** across all stages, with quick actions (single and bulk) to move candidates forward, contact them, or open details.

### 1.2 Layout Structure

- Page title + small description (localized).
- Filter bar (top).
- Action bar (below filters, shows when at least one candidate is selected).
- Candidate table (center).
- Pagination controls (bottom).
- Optional right‑side detail drawer for quick preview (mobile: full‑screen slide).

### 1.3 Filters (Filter Bar)

Implement a filter bar with the following fields:

- **Search box**:
  - Free‑text search by name, phone, email, candidate ID.
- **Stage / Status** (multi‑select chips or dropdown):
  - Values: LEAD, SURVEY_COMPLETED, DOCUMENTS_PENDING, DOCUMENTS_COMPLETED, IN_LEGAL_REVIEW, PAYMENT_PENDING, ASSIGNED, FOLLOW_UP.
- **Country / Region**:
  - Multi‑select of candidate’s nationality and/or target country (e.g., “Mexico”, “Colombia”, “Poland”).
- **Source Channel**:
  - WhatsApp, Referral, Job Board, HRappka import, Manual.
- **Language**:
  - ES, EN, PL (candidate’s primary communication language).
- **Date range**:
  - Filter by `created_at` or by `last_event_at` (switchable).
  - Presets: Today, Last 7 days, Last 30 days, Custom.
- **Owner / Recruiter** (if org uses ownership):
  - Dropdown with recruiters in the org.
- **Outcome** (for closed candidates):
  - Success, Legal Rejection, No‑show, Withdrawn.

Add a **“Clear filters”** button.

When filters change:

- Debounce free‑text search.
- Immediately refresh the list (no “Search” button needed), but keep network requests reasonable.

### 1.4 Candidate Table Columns

Desktop/tablet table columns (mobile collapses into cards):

- Checkbox (for multi‑select).
- Candidate name:
  - Full name.
  - Small flag icon for nationality (optional).
- Stage:
  - Localized label + colored chip (e.g., “En revisión legal”, “Docs pendientes”).
- Source:
  - Short label (WhatsApp, referral, etc.).
- Country / City (target assignment location).
- Primary language.
- Assigned project (if any):
  - Project name + site.
- Legal status summary:
  - Quick label: “OK”, “Pending docs”, “Invalid permit”, “Expired soon”.
- Payment status:
  - “Pending 800 PLN”, “Paid”, “Not required”.
- Last activity:
  - Date/time of last candidate event (message sent, document received, state change).
- Owner / Recruiter (if configured).

Each row is clickable:

- Click anywhere on the row (except checkboxes and inline actions) → navigate to Candidate Detail `/candidates/{id}`.
- Optional: small inline action icons on the right for “Open Detail”, “Send Message”, “Change Stage”.

### 1.5 Pagination & Sorting

- Server‑side pagination:
  - Page size options: 25, 50, 100.
  - Display “Showing X–Y of Z candidates”.
- Sorting:
  - Clickable column headers for:
    - Name, Stage, Country, Last activity, Project, Owner.
  - Default sort: `last_activity DESC`.

Remember: all queries must be tenant‑scoped (`organization_id`).

### 1.6 Bulk Actions (Action Bar)

When one or more candidates are selected:

- Show an Action Bar with:
  - Number of selected candidates (e.g. “3 selected”).
  - Actions (enabled only when applicable):
    - **Change stage**:
      - Opens a dialog to move all selected candidates to a different stage (e.g., from SURVEY_COMPLETED to DOCUMENTS_PENDING).
      - Require confirmation and trigger corresponding events per candidate.
    - **Assign to project**:
      - Opens a dialog to select project + planned start date.
      - Applies assignment to all selected candidates.
    - **Send message (template)**:
      - Opens a dialog:
        - Choose template (ES/EN/PL).
        - Select channel (WhatsApp/email).
        - Preview message for each candidate (use placeholders).
      - Confirms and schedules messages via the messaging worker.
    - **Mark follow‑up done** (for FOLLOW_UP stage):
      - Quickly close open follow‑ups with a small note (optional).
- Provide a “Select all on this page” and “Clear selection” option.

Make sure that all bulk operations are validated by the backend and failures are reported per candidate when needed.

### 1.7 Empty States & Errors

- No candidates matching filters:
  - Show friendly message (“No candidates found with these filters”) and a button “Reset filters”.
- General load error:
  - Show inline error with “Retry” that only re‑calls the list API.

---

## 2. Candidate Detail Screen

**Route example:** `/candidates/{id}`

The Candidate Detail screen gives a 360° view of a single candidate and is the main place to read and update all information.

### 2.1 Layout Structure

- Header with:
  - Candidate name.
  - Stage chip.
  - Key highlights (nationality flag, language, source).
  - Main actions (Send Message, Change Stage, Assign to Project).
- Tab bar with the following tabs:
  1. Profile
  2. Documents
  3. Legal
  4. Payments
  5. Timeline

The active tab is passed via navigation arguments (e.g., `?tab=legal`) so other screens (dashboard, legal queue) can deep‑link here.

### 2.2 Profile Tab

Sections:

1. **Basic Info**
   - Full name, date of birth, gender (if used).
   - Nationality, current country/city.
   - Primary and secondary languages.
   - Phone, email, preferred contact channel.
2. **Recruitment Info**
   - Source channel.
   - Owner/recruiter.
   - Current stage & sub‑status (with small description).
   - Desired position/type of work.
   - Availability (earliest start, notice period, shift preferences).
3. **Experience & Skills**
   - Short free‑text summary.
   - Optional structured fields (years of experience, industries, specific skills).
4. **Notes**
   - Internal notes (recruiter‑only).
   - Support markdown or plain text.

All fields read from existing entities; editing should open suitable dialogs or inline editable forms with client‑side validation.

### 2.3 Documents Tab

Show:

- List of documents linked to the candidate:
  - Type (passport, karta pobytu, visa, permit, decision of voivode, contract, diploma, etc.).
  - Number / identifier.
  - Issue date.
  - Expiry date.
  - Issuing country / authority.
  - Status: valid, expired, expiring soon.
- Each document row:
  - Has a quick view button to open the document (if stored as file URL).
  - Has actions: “Mark as verified”, “Mark as invalid”, “Replace / upload new version”.
- Group by category:
  - Identity documents.
  - Work/residence permits.
  - Other supporting docs.

Show warnings:

- If any critical document is expired or will expire within X days (configurable), show banner or icons.

### 2.4 Legal Tab

For LEGAL and RECRUITER roles (with different editing rights):

Content:

- **Legal status summary**:
  - Overall status: “Can legally work for this employer?”, yes/no/unclear.
  - Reason or note (e.g., “KP valid until 08.04.2026 but tied to previous employer; new application required.”).
- **Review history**:
  - List of legal reviews with:
    - Date, reviewer, decision (approved/rejected/request more docs).
    - Notes.
- **Current review**:
  - If candidate is in `IN_LEGAL_REVIEW`:
    - Show all key inputs needed by legal:
      - Document checklist.
      - Employer/project details.
      - Candidate’s planned start date.
    - Allow LEGAL to:
      - Approve → triggers stage change + event.
      - Reject → requires reason.
      - Request more documents → choose which docs are missing + comment.

Only LEGAL role can commit legal decisions; RECRUITER sees them read‑only.

### 2.5 Payments Tab

This tab tracks fees related to legalization or processing (e.g., 800 PLN).

Show:

- **Payment summary**:
  - Required fees (e.g., “Legalization fee 800 PLN”).
  - Whether the candidate is expected to pay or the client/employer.
- **Transactions list**:
  - Each record: type, amount, currency, date, status (pending, confirmed), method (transfer/cash), reference number, receipt file (if any).
- Actions:
  - “Register payment request” (create a pending record).
  - “Mark as paid” and attach receipt (URL/file metadata).
  - “Correct / cancel” with explanation.

Stage transitions can be triggered from here:
- When the key fee is marked as “paid and confirmed”, allow moving candidate from `PAYMENT_PENDING` to `ASSIGNED_READY`.

### 2.6 Timeline Tab

A chronological list of **Candidate Events**:

- Examples:
  - Candidate created.
  - Message sent (template X, channel Y).
  - Document uploaded.
  - Legal decision taken (approved/rejected).
  - Payment recorded.
  - Assignment to project X with date.
  - Follow‑up completed with note.

Display:

- Vertical timeline with timestamp, type, icon, and short description.
- Filters or quick chips to show/hide categories (Messages, Legal, Payments, Assignments, System).

Optionally allow adding manual events (“Add note to timeline”).

---

## 3. Legal Review Queue Screen

**Route example:** `/legal-review`

This screen is optimized for LEGAL role users to process candidates waiting for legal validation.

### 3.1 Layout Structure

- Page title: “Legal Review Queue” (localized).
- Filter bar:
  - Similar to Pipeline but focused on legal aspects:
    - Status: IN_LEGAL_REVIEW, AWAITING_DOCS, APPROVED, REJECTED.
    - Country / targeted country of work.
    - Document status: missing docs, expiring, ok.
    - Reviewer (legal user).
    - Date range: review requested date, decision date.
- Table/list of candidates in legal queue.
- Optional detail panel or modal for fast review.

### 3.2 Columns

- Candidate name.
- Nationality.
- Target employer/project.
- Key permit summary:
  - e.g., “KP valid to 08.04.2026 – previous employer”.
- Documents status:
  - “Complete”, “Missing X”, “Expired Y”.
- Requested by (recruiter).
- Requested on (date).
- Planned start date.
- Days until start (or overdue).
- Current legal status (chip):
  - “Pending review”, “Waiting docs”, “Approved”, “Rejected”.

Clicking a row opens Candidate Detail with `tab=legal`.

### 3.3 Quick Legal Actions

From the list (single row):

- Button or menu with:
  - “Open legal review” (goes to Legal tab).
  - “Approve” (only if documents complete).
  - “Reject” (opens modal to enter reason).
  - “Request documents” (choose missing docs + comment, sends message via template).

Bulk actions can be provided but are optional; if implemented, ensure they require confirmation and a consistent reason/comment.

### 3.4 Work Mode

Support two work modes for LEGAL:

- **List‑only mode**:
  - LEGAL clicks each candidate to open full Candidate Detail.
- **Split‑view mode (desktop)**:
  - Left side: queue list.
  - Right side: embedded Legal tab for the selected candidate.
  - Changing selection on the left updates right pane without full navigation.

---

## 4. Settings – Organization & Integrations

**Route examples:**
- `/settings/organization`
- `/settings/integrations`

Only ORGANIZATION OWNER / ADMIN can edit; other roles may see read‑only or no access.

### 4.1 Settings Shell

The Settings area has its own two‑column layout:

- Left sidebar:
  - Menu items:
    - Organization
    - Users & Roles (if implemented)
    - Branding
    - Integrations
    - Notifications (optional, for later)
- Right content panel:
  - Shows the active settings page.

### 4.2 Organization Settings Page

Fields:

- Organization name.
- Default language (ES/EN/PL).
- Supported languages (checkbox list).
- Default country/region (for candidates and projects).
- Timezone.
- Contact email and phone for candidate communications (used in templates).
- Legal entity information:
  - Company name, address, NIP/TIN, etc. (for contracts / docs).

Behaviours:

- Save button validates and calls backend to update the `organizations` table.
- Show a small “Settings updated” toast on success.

### 4.3 Branding Page

Fields:

- Logo upload (URL or file handled by existing upload mechanism).
- Primary color (color picker).
- Secondary color.
- Accent color (for buttons/chips).
- Favicon / app icon (for web).

Usage:

- Changes should reflect in the app theme (where theming is tenant‑aware).
- Show a live preview card with:

  - Logo.
  - Sample headline.
  - Sample button.

### 4.4 Integrations Page

List all supported integrations, each as a card:

- HRappka
- WhatsApp Business / messaging provider
- Google / Office 365 for calendar
- Email provider (SMTP / transactional service)
- Others defined in the project

Each card should show:

- Integration name + icon.
- Short description of what is synced.
- Status:
  - Not configured
  - Connected
  - Error (with last error message or code)
- Button: “Configure” or “Edit configuration”.

When user clicks “Configure”:

- Open a modal or nested page with required fields, e.g.:

  **HRappka:**
  - API base URL
  - API key / token
  - Organization ID / mapping fields

  **WhatsApp / Messaging:**
  - Provider type (Meta Cloud API, other BSP).
  - Phone number / business ID.
  - API key / secret.
  - Webhook URL (display only, generated from backend).
  - Test button to send a test message.

  **Calendar (Google/Microsoft):**
  - OAuth connection / authorization link.
  - List of connected calendars (if provided by backend).

- After saving, integration config is stored with the current organization and status is updated.

### 4.5 Permissions & Visibility

- Only OWNER / ADMIN can modify organization, branding, and integrations.
- RECRUITER and LEGAL:
  - May see some read‑only information (e.g., active integrations), or nothing, depending on feature flags; handle this cleanly (no errors, just hidden/disabled sections).

### 4.6 Error Handling

- If an integration check fails (e.g. invalid API key), show a clear error message on the Integration card and in the config form.
- Provide a “Re‑check connection” button per integration, which triggers a backend connectivity test.

---

## Implementation Notes

- Place UI files under structured folders, for example:
  - `lib/ui/pipeline/`
  - `lib/ui/candidate_detail/`
  - `lib/ui/legal_queue/`
  - `lib/ui/settings/organization/`
  - `lib/ui/settings/integrations/`
- Use the existing localization files (`es`, `en`, `pl`) and add all necessary keys.
- Use reusable components (buttons, chips, cards) defined elsewhere in the project to keep styling and interaction consistent with the Dashboard.

Follow these specs as the source of truth for behaviour and flows of these screens.
