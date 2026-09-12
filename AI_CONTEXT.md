# AI Context: Enterprise Knowledge System

## Purpose and product vision

This repository is the foundation of a permission-aware enterprise knowledge system. The stated problem is secure discovery of internal knowledge while enforcing role-based access to sensitive documents. The intended product also keeps an auditable trail of knowledge access. The current code does **not** yet implement knowledge ingestion/search, auth endpoints, or a user interface.

## Current source of truth

- Branch: `main`
- Code is the source of truth.

## Complete implemented stack

| Area | Implemented choice |
| --- | --- |
| Language/runtime | Node.js (plain JavaScript, CommonJS) |
| API framework | Express.js ^4.19.2 |
| Database ODM | Mongoose ^8.5.1 |
| Configuration | dotenv ^16.4.5 + fail-fast guard |
| Dependency tooling | npm / `package.json` / `package-lock.json` |
| Testing | Jest ^29.7.0 + supertest ^7.0.0 |
| Linting | ESLint ^9.8.0 (flat config, `eslint.config.mjs`) |
| Dev server | nodemon ^3.1.4 |

There is no Python, TypeScript, Docker, ORM migration framework, authentication library, or deployment configuration in the repository.

## Repository structure

```text
README.md                          root onboarding/readme
AI_CONTEXT.md                      detailed migration context
PROJECT_PLAN.md                    plan
TASKS.md                           continuation tracker
DECISIONS.md                       recorded decisions
backend/
  package.json                     npm project manifest + scripts
  eslint.config.mjs                ESLint flat config (ES2022, CommonJS)
  .env.example                     required env variable template
  .gitignore                       ignores node_modules/, .env, coverage/
  src/
    config.js                      reads MONGO_URI/PORT from env; throws if missing
    database.js                    connectDB() / disconnectDB() via Mongoose
    app.js                         Express app factory (no listen — testable)
    index.js                       entry point: connectDB then app.listen
    routes/
      health.js                    GET /health → { status: "ok" }
    models/
      user.js                      User Mongoose schema + ROLES enum
      document.js                  Document Mongoose schema
      auditLog.js                  AuditLog Mongoose schema
  tests/
    config.test.js                 4 tests: env validation, fail-fast, port default
    database.test.js               3 tests: connectDB/disconnectDB with mocked mongoose
    health.test.js                 3 tests: GET /health via supertest
    models.test.js                 17 tests: User, Document, AuditLog schema validation
frontend/                          empty directory; future placeholder only
```

## System and backend architecture (implemented)

```text
HTTP client
  -> Node.js / Express (src/app.js)
    -> GET /health -> { "status": "ok" }

Startup (src/index.js):
  connectDB() -> mongoose.connect(MONGO_URI, { dbName: "enterprise_knowledge_system" })
    -> fails fast (process.exit(1)) if DB unreachable
  -> app.listen(PORT)
```

`src/config.js` reads `MONGO_URI` (required) and `PORT` (default 8000) via `dotenv`. It throws at import time if `MONGO_URI` is missing. `src/database.js` exposes `connectDB()` and `disconnectDB()` using Mongoose. `src/index.js` calls `connectDB()` first — if it throws, the process exits with code 1 before the HTTP server starts.

## Frontend architecture

**UNKNOWN / not implemented.** `frontend/` exists but is empty.

## Database design

- Database name: `enterprise_knowledge_system` (set in `connectDB()` via `dbName` option).
- Collections: `users`, `documents`, `auditlogs` (Mongoose pluralises model names).
- Models: `src/models/user.js`, `src/models/document.js`, `src/models/auditLog.js`.
- Indexes/migrations: Not yet applied. Will be added during Phase 2/3.

### User schema fields
`email` (unique, required), `hashedPassword` (required), `role` (enum: viewer/editor/admin, default viewer), `isActive` (default true), `createdAt`, `updatedAt`.

### Document schema fields
`title` (required), `content`, `ownerId` (ObjectId ref User, required), `allowedRoles` (array of role enum, default ['viewer']), `tags`, `createdAt`, `updatedAt`.

### AuditLog schema fields
`userId` (ObjectId ref User, required), `action` (required), `resourceType` (required), `resourceId` (ObjectId), `metadata` (Mixed, default {}), `createdAt`, `updatedAt`.

## Authentication and authorization

**Not implemented.** Phase 2 will add JWT auth, bcrypt password hashing, and role-based middleware.

## API structure

Only one route is registered:

| Method/path | Location | Behavior |
| --- | --- | --- |
| `GET /health` | `src/routes/health.js` | returns `{"status":"ok"}` after server starts |

Express automatically returns 404 for unknown routes. There are no versioned API prefixes, auth endpoints, or business endpoints yet.

## Environment variables and secrets

| Variable | Required | Meaning |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string; treat as a secret (may embed credentials) |
| `PORT` | No | HTTP listen port; defaults to 8000 |

Never commit `.env`, connection strings, Atlas credentials, API keys, tokens, or passwords.

## Current implementation status

### Completed

- Node.js/Express.js backend scaffold replacing Python/FastAPI/uv.
- Mongoose connection with fail-fast startup (mirrors previous PyMongo lifespan ping).
- `GET /health` endpoint.
- ESLint flat config — zero errors, zero warnings.
- Jest test suite — 27 tests across 4 files, all passing.
- Mongoose models for User, Document, AuditLog with validation.
- GitHub Actions CI updated for Node.js 20 / npm / ESLint / Jest.
- D-010: Decision to migrate from Python to JavaScript recorded.

### Partially completed

- Project documentation: updated to reflect new JS stack.

### Known problems and discrepancies

1. The `npm test` output shows `--forceExit` is used because supertest leaves the Express server handle open. This is intentional and safe for the test suite.
2. `nodemon` is a dev dependency but not used in CI; use `npm run dev` locally.
3. No authentication, authorization, or business endpoints exist yet.

## Technical decisions supported by code

- Use Express.js for the API service (D-001 revised, D-010).
- Use Mongoose ODM rather than native driver (D-002 revised).
- Fail-fast startup: `connectDB()` throws, `index.js` exits on error (D-004 preserved).
- Single database named `enterprise_knowledge_system` (D-002 preserved).
- Use npm and `package-lock.json` for reproducible dependencies (D-005 revised).
- ESLint flat config for linting (D-011).

## Development commands

From `D:\enterprise-knowledge-system\backend`:

```powershell
npm install              # install dependencies
npm run dev              # start with nodemon (auto-reload)
npm start                # start server
npm test                 # run Jest suite
npx eslint src/          # lint check
```

## Testing and deployment

- Testing: Jest with supertest. 27 unit/integration tests across config, database, health endpoint, and models. Run with `npm test`.
- Linting: ESLint flat config. Run with `npx eslint src/`. Zero errors, zero warnings.
- CI/CD: GitHub Actions in `.github/workflows/ci.yml` — Node.js 20, `npm ci`, ESLint, Jest.
- Deployment: Hosting and production runtime are **UNKNOWN / not implemented** (Phase 5).

## Security considerations

- `MONGO_URI` is a secret; `.gitignore` excludes `.env`.
- Current API has no auth or authorization. Do not expose it as a production knowledge API.
- Startup requires a successful DB connection; server will not start if MongoDB is unreachable.
- Before any user/document feature is built, design identity, RBAC, audit-event retention, input validation, rate limiting, error handling, secret management, CORS, and database indexes.

## Guidance for the next AI agent

1. The backend is now plain JavaScript/Express/Mongoose. Do not introduce Python or TypeScript unless explicitly decided.
2. Phase 2 is auth: add `bcryptjs` (password hashing) and `jsonwebtoken` (JWT), then implement `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`.
3. Add Jest tests alongside each new feature.
4. `MONGO_URI` must never appear in logs, shell output, commits, or documentation.
5. The ESLint config uses flat format (`eslint.config.mjs`). Do not create `.eslintrc` files.
