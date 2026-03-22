# Ori‑Cruit – Full Project Readiness Audit
## Targets: Cloud Deployment · Local Dev Environment · Portable Windows Build

You are an expert **Full‑Stack Architect & DevOps Engineer** for the Ori‑OS ecosystem.  
Your task is to audit the `ori-cruit-hr-ops` project and produce everything needed so that:

1. The app runs reliably **in the cloud** (backend + DB + web frontend).
2. The app runs easily **locally on my laptop** (Windows) for development.
3. The **Windows desktop build** is available as a **portable, downloadable executable** my colleagues can install and run, connected to the same cloud backend.

Use the conventions already defined in:

- `ori-os-antigravity-prompt.md`
- `master-prompt.md`
- `ORI-OS Environment Variables Analysis & Setup Guide.md`

Do **not** change the high‑level architecture (Nest/Node backend + PostgreSQL + Flutter client + i18n + dark/light + multi‑tenant). Work *with* the existing structure.

---

## 0. Project Scanning and Context

1. Use filesystem MCP to inspect the repo:
   - Root files: `README.md`, `package.json`, `pnpm-workspace.yaml` (or equivalents), `.gitignore`, `.github/workflows/`, `Dockerfile*`, `docker-compose*`, etc.
   - All app folders: e.g. `apps/`, `backend/`, `api/`, `worker/`, `web/`, `app/`, `flutter/`, etc.
   - Existing environment files: `.env.example`, `.env`, and any env documentation (`KEYS-AND-SECRETS-*.md`, etc.).
2. Summarize in **5–8 bullet points**:
   - What modules exist (backend, worker, web, Flutter desktop, infra).
   - How they are currently built and started (scripts, Docker, etc.).
   - Any obvious TODOs / FIXME comments about deployment or builds.

---

## 1. Local Development (Laptop) – Audit & Fix

Goal: from a clean clone, I can run **ONE concise sequence of commands** to get:

- Postgres running and seeded.
- Backend/API running.
- Flutter app running (web and/or Windows) against that backend.

### 1.1 Dependencies & Tooling

- Detect whether the project expects `pnpm`, `npm`, or `yarn` (and which versions).
- Detect NodeJS version, Flutter version, and any required CLIs.

If versions are implicit, add them to:
- `README.md` → “Requirements” section.
- Optionally `.nvmrc` / `.tool-versions` if consistent with repo style.

### 1.2 Local DB Setup

- Locate DB client (Prisma, TypeORM, etc.) and migrations.
- Ensure there is:
  - A **single canonical command** to migrate the DB locally (e.g. `pnpm db:migrate` or `npx prisma migrate dev`).
  - An optional **seed command** (e.g. `pnpm db:seed`).

If missing:

- Create standardized scripts in `package.json` or workspace root to:
  - Run migrations.
  - Seed basic data (one org, one user, minimal templates).

Update `.env.example` with a **working local Postgres connection**, such as:

```env
DATABASE_URL="postgresql://ori_cruit:oriCruitDev123!@localhost:5432/ori_cruit_dev"

1.3 Local Backend & Frontend Commands
Standardize scripts so that, after pnpm install (or npm/yarn), I can do:

pnpm dev:api – start Nest/Node backend in dev mode.

pnpm dev:web – start Flutter or web frontend in dev mode (with API_BASE_URL pointing at local backend).

Optional: pnpm dev:all – start everything with a single command (concurrently).

If scripts exist under different names, create aliases in root package.json to normalize them.

Update README.md with a “Local Development – Quickstart” section containing, in order:

Clone repo.

Install dependencies.

Start Postgres (Docker or local).

Run migrations + seed.

Start API.

Start Flutter web/Windows app.

2. Cloud Deployment – Audit & Hardening
Goal: app can be deployed to a cloud provider (Docker or managed Node) with clear instructions, env vars and migration steps. Focus on production readiness patterns from standard checklists (health checks, logging, env separation, etc.).

2.1 Deployment Model
Detect if the repo already has:

Dockerfile / docker-compose.yml.

.github/workflows for build/deploy.

Any infra docs (Render/Fly.io/Vercel/etc.).

Summarize the current deployment assumptions:

Single container vs multi‑container (API, DB, worker).

Which service hosts Postgres (managed vs Docker).

If there is no clear deployment path, propose and implement a minimal one:

A single Dockerfile for the backend (Nest):

Multi‑stage build (builder image → smaller runtime image).

Runs npm run build then node dist/main.js.

Optionally a small Dockerfile / static host recipe for the Flutter web bundle.

2.2 Production Environment Variables
Using ORI-OS Environment Variables Analysis & Setup Guide as base, verify that .env.example (or equivalent) contains all required keys for prod:

DATABASE_URL

JWT_SECRET

PORT

NODE_ENV=production

Third‑party keys: HRAPPKA_API_KEY, WHATSAPP_API_KEY, email provider, etc.

If any required var is used in code but missing in .env.example, add it with a placeholder and short comment.

Ensure backend code fails fast and clearly when a required env var is missing (e.g., via a config module and schema validation).

2.3 Health Checks, Logging, and Error Handling
Verify backend exposes a GET /health (or similar) that checks:

Process alive.

DB connection OK.

If missing, implement a minimal health controller.

Ensure:

A consistent logger is used (Nest Logger or similar) with environment‑sensitive levels.

Global exception filter returns structured errors without leaking internals.

Document in README.md:

Health check endpoint.

Log location/format expectations.

2.4 CI/CD Hooks (Optional but Recommended)
If there are GitHub Actions:

Audit them:

Ensure they run tests/lint/build on PRs.

Optionally add a workflow that:

Builds backend Docker image.

Builds Flutter web bundle.

Can be manually triggered for deployment.

If there is no CI:

Add a minimal .github/workflows/ci.yml that:

Installs dependencies.

Runs pnpm lint / pnpm test if defined.

Runs backend build.

Runs flutter analyze and flutter build web --release to catch obvious issues.

3. Portable Windows Executable – Audit & Packaging
Goal: generate a Windows desktop build of the Flutter client and package it so colleagues can install it on their machines and connect to the same cloud API.

3.1 Flutter Windows Build
Confirm the Flutter project is configured for Windows (check windows/ folder and flutter config --enable-windows-desktop).

Ensure there is a build script documented:

bash
flutter build windows --release
Validate that:

The Windows build uses a configurable API_BASE_URL pointing to the cloud backend (prod URL).

API_BASE_URL can be set via:

Build‑time flavor, or

Small config file (e.g. config.json) read at startup.

If currently hard‑coded to localhost, refactor to read from a single config point so prod builds can target remote API.

3.2 Packaging as Installer or Portable Zip
Choose a simple strategy:

Portable ZIP (minimal effort):

build/windows/runner/Release is considered the distributable.

Add a script (e.g. scripts/package-windows.ps1) that:

Zips that folder into dist/ori-cruit-win64.zip.

Document for colleagues:

“Unzip and run OriCruit.exe”.

Installer (recommended for colleagues):

If Inno Setup or MSIX configuration exists, audit and fix:

App name, icon, version number.

Install location (e.g., C:\Program Files\Ori-Cruit).

Shortcut creation (Start Menu / Desktop).

If not present:

Create a minimal Inno Setup script in infra/installers/windows/ori-cruit.iss that:

Bundles build/windows/runner/Release.

Creates Start menu / Desktop shortcuts.

Optionally sets an uninstaller entry.

Add a section in README.md:

“Building Windows Desktop Installer”

Prerequisites (Flutter, Inno Setup if used).

Exact commands:

Build Flutter Windows release.

Run packaging script / build installer.

4. Output Format
After completing the audit and changes, produce:

A short summary (bullet points) of:

What was already OK.

What was missing and has been added.

Any remaining manual steps that must be done by the human (e.g., creating real API keys in provider dashboards).

A Deployment & Runbook section appended to README.md (or a new DEPLOYMENT.md) covering:

Local dev quickstart (step‑by‑step).

Cloud deployment steps (using the chosen provider / Docker image).

Windows desktop build & distribution steps.

Make sure all new or edited files compile/build without errors and respect the existing coding style and folder conventions of the repo.