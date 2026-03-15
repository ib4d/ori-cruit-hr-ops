# Ori‑Cruit Dashboard – Functional & UX Flow Specification

You are building the **main dashboard experience** for Ori‑Cruit, an international recruitment & HR operations SaaS.

The goal of this prompt is to define, in detail, how the **dashboard and its flows** must behave so that the implementation is consistent, bug‑free, and fully aligned with the existing Ori‑Cruit architecture and design spec.

Assume the global architecture, data model, and UI themes are already defined in the project (Nest/Node backend + PostgreSQL + Flutter client + i18n ES/EN/PL + dark/light theme), as described in the existing Ori‑Cruit build prompt. Do NOT change the architecture, entities or routing; implement and wire the dashboard on top of what already exists.

---

## 1. High‑Level Dashboard Goals

The dashboard must:

1. Give recruiters and legal users an **instant overview** of:
   - How many candidates are at each stage of the pipeline.
   - Which cases are blocked (missing documents, pending legal review, pending payment).
   - Which candidates are starting soon or need follow‑up.
2. Provide **quick entry points** into:
   - Candidate Pipeline view.
   - Legal Review queue.
   - Today / This week’s tasks (interviews, arrivals, follow‑ups).
3. Communicate the **value proposition** of Ori‑Cruit:
   - International recruitment, LATAM focus, legal compliance, automation.
   - Integrations (HRappka, WhatsApp, Google/Calendar, etc.).
4. Respect:
   - Multi‑language (ES/EN/PL) – all strings from i18n.
   - ThemeMode (dark as default, light as alternative).
   - Tenant branding (logo, primary color, etc.) per organization.

The dashboard is **not** a static marketing page; it is a hybrid landing + operational control panel.

---

## 2. Layout Structure

### 2.1 Global Shell

The dashboard lives inside the main app shell, which includes:

- Top navigation bar:
  - App logo + “Ori‑Cruit” or tenant logo/name.
  - Navigation items: Dashboard (active), Pipeline, Legal, Settings, etc.
  - Persistent language switcher (ES/EN/PL) that changes locale at runtime.
  - Theme toggle (dark/light) with persisted preference.
  - User avatar / menu (profile, logout).
- Optional sub‑header (breadcrumb / page title) when needed.

All these elements must use the existing theme and localization system.

### 2.2 Dashboard Page Sections

The main dashboard page is organized vertically in sections:

1. **Hero / Overview Section (top)**
   - Large title that changes with locale, e.g. “Smarter Hiring, Seamless Management, Happier Teams”.
   - Subtitle focusing on international recruitment, LATAM candidates, and automation.
   - A primary CTA button that navigates to the “New Candidate” flow (or to the Pipeline with a filter to create a new record).
   - A secondary CTA that leads to a quick tour or documentation.

2. **Mini‑Pipeline Widget (primary above‑the‑fold element)**
   - A compact component showing a simplified pipeline:
     - Columns (or steps): LEADS → SURVEY → DOCUMENTS → LEGAL REVIEW → PAYMENT → ASSIGNED → FOLLOW‑UP.
     - For each step:
       - Count of active candidates.
       - Sub‑status indicator if there are blockers (e.g. X with missing documents).
   - Clicking a column opens the Pipeline screen with filters preset to that stage.

3. **Key Metrics / KPIs Strip**
   - A row of 3–4 cards showing metrics such as:
     - Time to approve legal (average days).
     - Time from contact to assignment.
     - Number of arrivals this week.
     - Number of no‑shows in the last X days.
   - These values are loaded via dashboard API endpoints that aggregate candidate and assignment data.

4. **Work Queues & Shortcuts Section**
   - Two or more cards:
     - “Legal Review Queue”:
       - Shows the number of candidates in `IN_LEGAL_REVIEW`.
       - Lists the top 3–5 candidates with most urgent deadlines (soonest planned start date).
       - “View all” button navigates to the Legal Review screen.
     - “Today’s Actions”:
       - List of tasks derived from candidate events:
         - Interviews scheduled today.
         - Arrivals today.
         - Follow‑ups due today.
       - Each task row is clickable and opens the Candidate Detail view (with the relevant tab pre‑selected: timeline or follow‑up).

5. **Integrations Section**
   - Visually displays icons for connected services (HRappka, WhatsApp, Google, Slack, etc.).
   - Each card shows:
     - Integration name.
     - Connection status (connected / not connected / error).
     - Short description.
     - Button to “Manage integration” which navigates to the Settings → Integrations screen.

6. **Testimonials / Benefits & Compliance Section (optional but recommended)**
   - Cards summarizing benefits: fewer legal mistakes, faster onboarding, less manual WhatsApp chaos.
   - Static copy only; no complex logic.

7. **Footer**
   - Links to support, documentation, privacy, terms, and system status.
   - Uses tenant or Ori‑Cruit branding depending on configuration.

---

## 3. Data Flow & State Management

### 3.1 Initial Data Load

When the dashboard screen mounts:

1. Resolve the current **organization/tenant** from the auth context.
2. In parallel, fetch:
   - `GET /dashboard/pipeline-summary` – counts per pipeline stage.
   - `GET /dashboard/kpis` – aggregated metrics.
   - `GET /dashboard/legal-queue-preview` – small list of candidates in legal review.
   - `GET /dashboard/today-actions` – today’s tasks (interviews, arrivals, follow‑ups).
   - `GET /dashboard/integrations-status` – integration connection flags.
3. Show a skeleton/loading state for each section until its data arrives.
4. If a call fails:
   - Show a non‑blocking error message in that section (“Couldn’t load metrics, try again”) with a “Retry” button.
   - Do not break the whole dashboard.

Use the app’s existing state management solution (e.g., Riverpod/BLoC/Provider) with a `DashboardController` / `DashboardViewModel` that exposes:

- `pipelineSummaryState`
- `kpiState`
- `legalQueueState`
- `todayActionsState`
- `integrationsState`

Each state should support: `loading`, `success`, `error`.

### 3.2 User Interactions

Key interactions:

- Clicking a pipeline column:
  - Navigate to `/pipeline` with query parameters or navigation args:
    - `stage = {LEADS|SURVEY|DOCUMENTS|LEGAL_REVIEW|PAYMENT|ASSIGNED|FOLLOW_UP}`
  - The Pipeline screen reads these params and pre‑applies filters.

- Clicking a candidate in Legal Review preview:
  - Navigate to `/candidates/{candidateId}`.
  - Candidate Detail should open with the **Legal** tab active.

- Clicking a task in Today’s Actions:
  - Navigate to `/candidates/{candidateId}` with context of action.
  - Optionally scroll or highlight the relevant timeline entry or follow‑up.

- Clicking “Manage integration”:
  - Navigate to `/settings/integrations`, with the specific integration card scrolled into view or highlighted.

- Switching language (ES/EN/PL) or theme:
  - Immediately re‑render all dashboard texts and apply corresponding theme without full restart.
  - Persist the user choice (local storage / SharedPreferences).

---

## 4. Detailed Behaviour per Component

### 4.1 Mini‑Pipeline Widget

**Structure:**

- Horizontal bar with one cell per stage.
- Each cell shows:
  - Stage name (localized).
  - Integer count (e.g., “12”).
  - Optional small badge if there are blockers (e.g., “3 missing docs”).

**Data source:**

- API returns something like:

  ```json
  {
    "LEADS": { "count": 20 },
    "SURVEY": { "count": 15 },
    "DOCUMENTS": { "count": 8, "missingDocs": 3 },
    "LEGAL_REVIEW": { "count": 5, "overdue": 1 },
    "PAYMENT": { "count": 4 },
    "ASSIGNED": { "count": 12, "startingSoon": 2 },
    "FOLLOW_UP": { "count": 10 }
  }
Interactions:

Tap/click on a cell:

Navigate to Pipeline screen.

Pipeline filter: status = <stage>.

For DOCUMENTS or LEGAL_REVIEW, pre‑select the sub‑filter for “missing docs” or “overdue” if the user clicks directly on the badge.

4.2 KPIs Cards
Each card reads from the KPIs API, for example:

avgLegalReviewDays

avgTimeToAssignment

arrivalsThisWeek

noShowsLast30Days

Display:

Large numeric value.

Short description string from i18n (per language).

Optional trend icon (up/down) if the backend provides a comparison vs previous period.

If KPIs fail to load, show a generic placeholder (“–”) and a retry action.

4.3 Legal Review Preview
Show up to N (e.g., 5) candidates with:

Name.

Country.

Last document received date.

Planned start date.

Days until start (or “overdue” if planned date is in the past).

Entries are sorted by soonest start date, then by creation date.

Clicking a row → opens Candidate Detail with Legal tab active.

4.4 Today’s Actions
Task types:

INTERVIEW

ARRIVAL

FOLLOW_UP

For each:

Display icon, type label, candidate name, time, project/site and short note (if available).

Clicking a task navigates to Candidate Detail.

Tasks are grouped or labelled by time (“Morning”, “Afternoon”) if the backend provides timestamps.

If no tasks today, show a friendly empty state (“No actions for today — your pipeline is up to date!”).

4.5 Integrations Status
Each integration card shows:

Icon + name (HRappka, WhatsApp, Google Calendar, etc.).

Status chip: “Connected”, “Not connected”, “Error”.

Last sync timestamp if applicable.

Clicking the card or “Manage” button opens the integration detail/Settings page where credentials and options are configured.

5. Permissions & Multi‑Tenant Behaviour
All dashboard data must be tenant‑scoped:

Only return entities with organization_id matching the user’s current org.

Respect roles:

RECRUITER:

Sees only their own candidates by default.

The pipeline summary and KPIs are scoped to:

Either all org data, or

Only their candidates, depending on a configuration flag. (Implement a simple toggle or future‑proof for this.)

LEGAL:

Sees legal queue and relevant KPIs.

ADMIN / OWNER:

Sees org‑wide data.

If permission is missing for a section (e.g., a VIEWER role), show a locked/disabled state instead of an error.

6. i18n & Theming Requirements
All text on the dashboard must come from the localization system.

Keys like: dashboard.title, dashboard.subtitle, dashboard.pipeline.leads, etc.

Dark theme is the default. The dashboard should:

Use gradient backgrounds inspired by the reference (green/blue on dark).

Use high contrast for text and numbers.

Light theme:

Uses subtle backgrounds, cards with shadows, and avoids harsh pure white when possible.

Colors must respect the per‑tenant palette (primary color, accent color) when defined.

7. Error Handling & Empty States
If no candidates exist yet:

The pipeline widget shows zeros and an educational empty state (e.g., “Start by adding your first candidate” with a button to New Candidate).

For network or backend errors:

Never crash the entire dashboard.

Each section shows:

Short error message.

“Retry” button that re‑calls only that section’s API.

8. Implementation Checklist
When implementing this dashboard, ensure you:

Create a DashboardScreen (or equivalent) in the Flutter project under lib/ui/dashboard/.

Implement a DashboardController / ViewModel under lib/state/ (or equivalent) that:

Calls all dashboard APIs in parallel.

Exposes section‑wise state (loading/success/error).

Wire navigation from:

Header navigation item “Dashboard”.

Post‑login redirect → Dashboard.

Ensure all strings are present in ES/EN/PL translation files.

Add basic widget tests for:

Rendering loading state.

Rendering sample data.

Navigating to Pipeline and Candidate Detail when clicking on widgets.

Follow the existing file structure and coding conventions of the Ori‑Cruit Flutter client. Do not introduce a different state management library than what is already used in the project.