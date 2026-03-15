# Ori-Cruit — International Recruitment & HR Ops SaaS

> Multi‑tenant | White‑label | GDPR/RODO compliant | ES/EN/PL

Ori-Cruit is a production-grade International Recruitment & HR Operations platform built for agencies managing foreign workers (LATAM → Poland / EU). It automates the full candidate lifecycle — from lead capture to legal assignment — with built-in compliance, multi-language support, and WhatsApp integration.

---

## Architecture

```
ori-cruit/
├── web/          # React (Vite) marketing landing page
├── backend/      # NestJS API (multi-tenant, PostgreSQL / Prisma)
├── workers/      # Background workers (webhooks, messaging, retention)
├── app/          # Flutter client (mobile + web) — to be added
└── recruitment-ops-architect/  # Architecture docs & agent prompts
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | NestJS + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Frontend (Marketing) | React + Vite + GSAP |
| Mobile/Web App | Flutter (upcoming) |
| Workers | Node.js background jobs |
| Auth | JWT + sessions |
| Messaging | WhatsApp Business Cloud API |
| Storage | S3-compatible |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally or a managed instance URL
- (Optional) Flutter SDK for mobile/web app

### 1. Install dependencies

```bash
# Root
npm install

# Backend
cd backend && npm install

# Workers
cd workers && npm install

# Marketing web
cd web && npm install
```

### 2. Configure environment

```bash
# Copy and fill in your values
cp .env.example .env
cp backend/.env.example backend/.env
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start development servers

```bash
# Terminal 1 — Backend API (http://localhost:3000)
cd backend && npm run start:dev

# Terminal 2 — Workers
cd workers && npm run dev

# Terminal 3 — Marketing landing (http://localhost:5173)
cd web && npm run dev

# Terminal 4 — Flutter web app (upcoming)
# cd app && flutter run -d chrome
```

---

## Multi-tenant Architecture

Each **Organization** (tenant) has:
- Its own isolated data (`organization_id` on every row)
- Custom branding (logo, colors, domain)
- Default language (ES / EN / PL)
- Optional custom domain resolution

Tenant is resolved from:
1. **JWT token** → `organization_id` in payload
2. **Request domain** → mapped via `organization_domains` table

---

## Module Map (Backend)

| Module | Description |
|--------|-------------|
| `auth` | Login, register, JWT, org membership |
| `organizations` | Tenants, branding, domains, settings |
| `users` | User accounts, roles |
| `candidates` | Core pipeline records |
| `candidate-documents` | Document upload, verification |
| `legal-reviews` | Legal approval workflow |
| `projects` | Job/project records |
| `assignments` | Candidate ↔ Project links |
| `payments` | 800 PLN legalization fees |
| `follow-ups` | Scheduled reminders |
| `consents` | GDPR/RODO consent records |
| `message-templates` | WhatsApp/email templates (ES/EN/PL) |
| `messages` | Sent message log |
| `candidate-events` | Audit timeline |
| `audit-log` | Full audit trail |
| `integrations` | HRappka, WhatsApp, Google Calendar |
| `compliance` | GDPR retention policies |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/oricruit
JWT_SECRET=your_jwt_secret_here
WHATSAPP_API_TOKEN=
HRAPPKA_API_KEY=
```

---

## Deployment

**Recommended production stack:**
- **Backend + Workers**: Railway / Render / Fly.io
- **Database**: Supabase / Neon (EU region, GDPR-compliant)
- **Marketing web**: Vercel / Netlify
- **Assets / Storage**: Cloudflare R2 or AWS S3 (EU)

See `docker-compose.yml` for complete local infra setup.

---

## Languages

Full UI and messaging templates in:
- 🇪🇸 Spanish (ES) — primary for candidates
- 🇬🇧 English (EN) — international
- 🇵🇱 Polish (PL) — recruiter-facing

---

## GDPR / RODO Compliance

- Consent collected and stored per candidate per purpose
- Data export endpoint (`GET /candidates/:id/export`)
- Anonymisation endpoint (`DELETE /candidates/:id`)
- Retention policies enforced by worker jobs
- Full audit log for all sensitive entity access
- No personal data sent to third parties without explicit org consent

---

## License

Proprietary — All rights reserved, Ori-Cruit SaaS.
