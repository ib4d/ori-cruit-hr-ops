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

## Quick Start — Local Development

### Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally or a managed instance URI
- Optional: Flutter SDK (if working on full desktop app)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/ib4d/ori-cruit-hr-ops.git
cd ori-cruit-hr-ops

# Install all dependencies (Backend, Web, Workers)
npm run install:all
```

### 2. Configure Environment
```bash
# Copy env templates
cp .env.example .env
cp backend/.env.example backend/.env

# Open .env and ensure DATABASE_URL is set correctly:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/oricruit"
```

### 3. Run Migrations & Seed Data
```bash
# Safely apply Prisma schema to database
npm run db:migrate

# Seed initial tenants, mock data
npm run db:seed
```

### 4. Start the Application
```bash
# Starts the NestJS Backend, Vite Web, and Workers concurrently
npm run dev
# Alternately: npm run dev:all
```

---

## Deployment & Runbook

### Cloud Deployment (Docker)

A multi-stage `Dockerfile` is provided in `/backend` to containerize the NestJS API. This is production-ready for platforms like Fly.io, Render, Railway, or AWS ECS.

1. **Required Environment Variables in Production:**
   - `NODE_ENV="production"`
   - `DATABASE_URL` (production database uri)
   - `PORT` (usually `3000` or defined by provider)
   - `JWT_SECRET` (secure random string)
   - `API_BASE_URL`
   - External Keys (HRappka, WhatsApp, Resend/SMTP).

2. **Docker Compose example:**
   ```yaml
   services:
     api:
       build: 
         context: .
         dockerfile: backend/Dockerfile
       ports: ["3000:3000"]
       environment:
         - DATABASE_URL=postgres://user:pass@db:5432/oricruit
         - JWT_SECRET=strongsecret
   ```

3. **CI/CD Automation:**
   - The `.github/workflows/ci.yml` file handles PR unit testing and build verification automatically on push to `main`.

### Health Checks

The backend automatically exposes a health endpoint at `GET /health` which validates process stability and database accessibility.

### Portable Client / Windows Build

To generate the distributable client for colleagues on Windows:

**Flutter Approach (Upcoming Desktop App):**
1. Make sure Flutter Windows is enabled: `flutter config --enable-windows-desktop`
2. Build the app from `app/` folder: `flutter build windows --release`
3. We provide an automatic packaging script. Run `powershell ./scripts/package-windows.ps1`
4. The `.zip` will be produced in the `dist/` directory, which can be unzipped by users.

---

## License

Proprietary — All rights reserved, Ori-Cruit SaaS.
