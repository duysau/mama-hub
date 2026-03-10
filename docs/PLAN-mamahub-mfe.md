# PLAN: MamaHub Micro Frontend (MFE)

## 1. Overview

Building MamaHub, a PWA for managing family finances and baby care (with future multi-tenant capabilities). The architecture will utilize Next.js Multi-Zones within a Turborepo to ensure **independent deployments** for micro-apps, while addressing the edge cases of real-time sync (centralized in the Shell app) and offline caching (scoped per micro-app).

## 2. Project Type

**WEB** (Next.js, Next.js Multi-Zones, Turborepo, PWA, Node.js + Postgres self-hosted)

## 3. Success Criteria

- Independent deployment capabilities for `finance-app` and `baby-app`.
- `shell-app` effectively routing requests via Next.js Multi-Zones (rewrites).
- Real-time WebSocket connection maintained in `shell-app` and broadcasted to MFEs (via BroadcastChannel API or shared context).
- Offline support (PWA/Service Worker) works robustly within the scope of the accessed MFE.
- Data synchronized via local-first DB (e.g., RxDB/WatermelonDB) to self-hosted PostgreSQL.

## 4. Tech Stack

- **Frontend Core**: Next.js (App Router/Pages depending on MFE preference), React, Turborepo (Monorepo).
- **Styling**: TailwindCSS, Shadcn UI / Radix (Shared in UI package).
- **Real-time**: Socket.io or native WebSockets, BroadcastChannel API.
- **Offline/PWA**: `next-pwa` or Workbox, IndexedDB (RxDB/WatermelonDB).
- **Backend/DB**: Node.js (Express/Fastify), self-hosted PostgreSQL, Prisma/Drizzle ORM.

## 5. File Structure

```text
mama-hub/
├── apps/
│   ├── shell-app/       (Root `/`, Auth, Global Navigation, WebSocket client)
│   ├── finance-app/     (Feature: Finance, served at `/finance`)
│   └── baby-app/        (Feature: Baby, served at `/baby`)
├── packages/
│   ├── ui/              (Shared components: buttons, layouts, Tailwind config)
│   ├── config/          (Shared ESLint, TS configs)
│   └── lib/             (Shared business logic, standard fetchers, DB schemas)
├── package.json         (Turborepo workspace)
└── turbo.json
```

## 6. Task Breakdown

### Task 1: Initialize Monorepo & Base Packages

- **Agent**: `frontend-specialist`
- **Skills**: `app-builder`, `clean-code`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Empty directory
- **OUTPUT**: Turborepo initialized with `ui` and `config` packages; basic linting and prettier setup.
- **VERIFY**: `npm run lint` and `npm run build` pass for all packages.

### Task 2: Setup Database & Backend Skeleton (Separate Repo)

- **Agent**: `backend-specialist`, `database-architect`
- **Skills**: `database-design`, `nodejs-best-practices`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: Schema requirements for Auth, Finance (transactions, categories), Baby (feedings, schedules).
- **OUTPUT**: A separate repository for the Node.js `api-server` connected to PostgreSQL with ORM schema and basic CRUD.
- **VERIFY**: API runs locally on port 4000, DB migrates successfully.

### Task 3: Build Web Apps & Next.js Multi-Zones

- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Base Turborepo workspace
- **OUTPUT**: `shell-app` (port 3000), `finance-app` (port 3001), `baby-app` (port 3002). Shell app correctly rewrites `/finance` and `/baby` to respective apps.
- **VERIFY**: Browsing `localhost:3000/finance` correctly loads the `finance-app` UI.

### Task 4: Implement Base UI & Authentication

- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P1
- **Dependencies**: Task 2, Task 3
- **INPUT**: Shell app & API server
- **OUTPUT**: Login flow in Shell app, JWT/Cookie session shared across sub-domains/rewrites.
- **VERIFY**: Logging into Shell allows access to protected routes in Finance and Baby apps.

### Task 5: Implement Real-time WebSocket (Shell -> MFEs)

- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`
- **Priority**: P2
- **Dependencies**: Task 4
- **INPUT**: Shell app & MFE apps
- **OUTPUT**: WebSocket listener in `shell-app` broadcasting events via BroadcastChannel to MFEs.
- **VERIFY**: Backend event triggers notification globally, regardless of which MFE is open.

### Task 6: Setup PWA and Local-First Offline Storage

- **Agent**: `frontend-specialist`
- **Skills**: `react-best-practices`, `performance-profiling`
- **Priority**: P2
- **Dependencies**: Task 3
- **INPUT**: Next.js apps
- **OUTPUT**: Service workers registered for Shell, Finance, and Baby apps. IndexedDB setup for offline mutations.
- **VERIFY**: Turning off network tab allows viewing previously loaded Baby schedules.

## ✅ PHASE X COMPLETE

- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: [ ]
