# Task Tracker

## Completed

- [x] Create Python 3.14 / uv backend project — **SUPERSEDED by D-010 migration**.
- [x] Establish all Python-era foundation (FastAPI, PyMongo, Pydantic models, pytest, Ruff, CI) — **SUPERSEDED by D-010 migration**.
- [x] **D-010 migration**: Delete entire Python backend and rebuild in plain JavaScript.
  - [x] Remove Python source, tests, pyproject.toml, uv.lock, requirements.txt, .python-version.
  - [x] Scaffold `backend/` as npm project (package.json, .gitignore, .env.example).
  - [x] `backend/src/config.js` — fail-fast env config (MONGO_URI required, PORT default 8000).
  - [x] `backend/src/database.js` — Mongoose `connectDB()` / `disconnectDB()`.
  - [x] `backend/src/app.js` — Express app factory (exported, no listen).
  - [x] `backend/src/routes/health.js` — `GET /health` → `{ status: "ok" }`.
  - [x] `backend/src/index.js` — entry point: connectDB then app.listen.
  - [x] `backend/src/models/user.js` — User Mongoose schema + ROLES enum (viewer/editor/admin).
  - [x] `backend/src/models/document.js` — Document Mongoose schema with allowedRoles.
  - [x] `backend/src/models/auditLog.js` — AuditLog Mongoose schema.
  - [x] `backend/eslint.config.mjs` — ESLint flat config (0 errors, 0 warnings).
  - [x] `backend/tests/config.test.js` — 4 tests (fail-fast, env loading, port default).
  - [x] `backend/tests/database.test.js` — 3 tests (mocked Mongoose connect/disconnect).
  - [x] `backend/tests/health.test.js` — 3 tests (supertest GET /health).
  - [x] `backend/tests/models.test.js` — 17 tests (User, Document, AuditLog validation).
  - [x] **27/27 Jest tests passing**, ESLint clean.
  - [x] Update `.github/workflows/ci.yml` for Node.js 20 / npm ci / ESLint / Jest.
  - [x] Update all project docs (AI_CONTEXT.md, TASKS.md, DECISIONS.md, HANDOFF.md, README.md).

## In progress

- [ ] Phase 2: Identity and authentication (password hashing, JWT issuance/validation, auth routes).

## Blocked

- None.

## Next

- [ ] Add `bcryptjs` and `jsonwebtoken` to `backend/`.
- [ ] Implement auth routes: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`.
- [ ] Implement Express middleware: `authenticateToken`, `requireRole(role)`.
- [ ] Add Jest tests for auth utilities and routes.

## Future

- [ ] Implement document/knowledge CRUD endpoints with role-based filtering (Phase 3).
- [ ] Implement auditable access events (Phase 4).
- [ ] Select and implement a frontend in `frontend/` only after backend contracts are defined.
- [ ] Add deployment configuration, secret management, monitoring, and security hardening (Phase 5).

## Continuation notes

- Backend is now **plain JavaScript / Express.js / Mongoose / Jest / ESLint**.
- Run `npm install` once in `backend/`, then `npm test` and `npx eslint src/`.
- `MONGO_URI` is required. Copy `.env.example` to `.env` and fill in the connection string.
- 27 Jest tests pass. CI updated for Node.js 20.
