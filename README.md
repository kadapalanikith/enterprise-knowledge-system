# Enterprise Knowledge System

A permission-aware enterprise knowledge system — secure discovery of internal knowledge with role-based access control and an auditable trail. Currently in **Phase 1 (foundation complete)**.

## Stack

| Area | Technology |
|---|---|
| Runtime | Node.js (plain JavaScript) |
| Framework | Express.js |
| Database | MongoDB Atlas via Mongoose |
| Testing | Jest + supertest |
| Linting | ESLint (flat config) |
| CI | GitHub Actions (Node.js 20) |

## Prerequisites

- Node.js 20+
- npm
- A MongoDB Atlas cluster (or local MongoDB instance)

## Setup

```powershell
# 1. Clone the repo
git clone <repo-url>
cd enterprise-knowledge-system

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment
copy .env.example .env
# Edit .env and set MONGO_URI to your MongoDB connection string
```

## Running the server

```powershell
# From backend/
npm start           # production start
npm run dev         # development mode with auto-reload (nodemon)
```

The server starts on port 8000 by default (set `PORT` in `.env` to override).

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Returns `{"status":"ok"}` when the server is up and DB is connected |

## Testing & Linting

```powershell
# From backend/
npm test            # run Jest test suite (27 tests)
npx eslint src/     # lint check
```

## Project documentation

| File | Purpose |
|---|---|
| `AI_CONTEXT.md` | Detailed technical context for AI agents |
| `TASKS.md` | Task tracker |
| `DECISIONS.md` | Architectural decisions (D-001 to D-011) |
| `HANDOFF.md` | Operational handoff for session continuation |
| `PROJECT_PLAN.md` | Roadmap and phase milestones |
| `AGENTS.md` | Persistent instructions for all AI coding agents |

## Roadmap

- **Phase 1 ✅** — Backend foundation (Express, Mongoose, health endpoint, models, tests)
- **Phase 2** — Authentication (bcryptjs + JWT, register/login/me endpoints, role middleware)
- **Phase 3** — Knowledge/document CRUD with RBAC filtering
- **Phase 4** — Audit event persistence
- **Phase 5** — Frontend, deployment, monitoring, hardening
