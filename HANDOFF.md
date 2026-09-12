# Handoff

## Current state

The backend has been **fully migrated from Python/FastAPI/uv to plain JavaScript/Express.js/Mongoose/npm**. The Python code is gone. The JS foundation is in place with an equivalent feature set and a passing test suite.

## Recent work

- Deleted all Python source, test, and tooling files from `backend/`.
- Rebuilt `backend/` as a Node.js npm project:
  - Express.js app with `GET /health`
  - Mongoose with fail-fast startup DB connection
  - Three Mongoose models: User, Document, AuditLog (with RBAC role enum)
  - ESLint flat config (0 errors, 0 warnings)
  - Jest test suite: **27/27 passing** across config, database, health, and models
- Updated GitHub Actions CI from Python/uv to Node.js 20 / npm ci / ESLint / Jest.
- Updated all project documentation (AI_CONTEXT, TASKS, DECISIONS, HANDOFF, README).

## Blockers

None.

## Immediate next actions

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` to the Atlas connection string.
2. Run `npm install` in `backend/` (first time only, or after `git clone`).
3. Start the server: `npm start` (or `npm run dev` for auto-reload).
4. Begin Phase 2: add `bcryptjs` + `jsonwebtoken`, implement auth routes (`/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`), and add token middleware.

## Test commands

```powershell
# From backend/
npm install         # install dependencies
npm test            # run Jest (27 tests)
npx eslint src/     # lint check
npm start           # start server (requires MONGO_URI in .env)
npm run dev         # start with auto-reload
```

## Key file locations

| File | Purpose |
|---|---|
| `backend/src/config.js` | Env config — throws if `MONGO_URI` missing |
| `backend/src/database.js` | `connectDB()` / `disconnectDB()` |
| `backend/src/app.js` | Express app factory |
| `backend/src/index.js` | Server entry point |
| `backend/src/routes/health.js` | `GET /health` |
| `backend/src/models/user.js` | User schema + ROLES |
| `backend/src/models/document.js` | Document schema |
| `backend/src/models/auditLog.js` | AuditLog schema |
| `backend/tests/` | Jest test suite |
| `.github/workflows/ci.yml` | CI: Node.js 20, npm ci, ESLint, Jest |
