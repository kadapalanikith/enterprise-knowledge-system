# Decisions

## Recording scope

Only decisions evidenced in current code/documentation are recorded here. The repository contains one initial commit and no design record, so rationale not expressed by the code or README is marked **UNKNOWN** rather than reconstructed.

## D-001 — Use Express.js for the backend API (revised from FastAPI — see D-010)

- **Decision:** Build the backend with Express.js (`backend/src/app.js`, `backend/src/index.js`).
- **Reason:** Migrated from FastAPI to JavaScript/Express per D-010. Express is minimal, widely adopted, and the developer is already familiar with JavaScript.
- **Alternatives considered:** Fastify, Hono, NestJS — Express chosen for familiarity and ecosystem breadth.
- **Consequences:** API routes, middleware, and error handling follow Express conventions. No auto-generated OpenAPI docs (must be added explicitly in future).

## D-002 — Use Mongoose ODM against MongoDB (revised from PyMongo — see D-010)

- **Decision:** Use Mongoose ^8.5.1 in `backend/src/database.js`; database is `enterprise_knowledge_system`.
- **Reason:** Mongoose provides schema-based validation, model methods, and a familiar pattern for JS developers. Replaces async PyMongo.
- **Alternatives considered:** Native MongoDB Node.js driver (lower-level, no schema), Prisma (great DX but heavier).
- **Consequences:** Future persistence code should use Mongoose model patterns. Schema validation is handled in `src/models/`.

## D-003 — Load configuration from environment variables via dotenv

- **Decision:** Read `MONGO_URI` and `PORT` in `backend/src/config.js` using `dotenv`; throw at import time if `MONGO_URI` is absent.
- **Reason:** Replaces Pydantic Settings. Same fail-fast contract: server cannot start without required config. `.env` excluded from Git.
- **Alternatives considered:** Hard-coded values (rejected), `dotenv-safe` (overkill for now).
- **Consequences:** Every runtime needs a valid `MONGO_URI`. Use `.env.example` as the template.

## D-004 — Fail application startup if MongoDB cannot connect (preserved from Python era)

- **Decision:** `src/index.js` calls `connectDB()` before `app.listen()`; on error, logs the message and exits with code 1.
- **Reason:** Same contract as the previous FastAPI lifespan ping. Server should not accept HTTP traffic if the database is unreachable.
- **Alternatives considered:** Lazy connection, retries, degraded mode — deferred to Phase 5.
- **Consequences:** The API is unavailable during a MongoDB outage. This is intentional.

## D-005 — Use npm and package-lock.json for reproducible dependencies (revised from uv)

- **Decision:** Manage the backend with npm, `package.json`, and committed `package-lock.json`.
- **Reason:** Replaces Python uv/lockfile. Standard Node.js tooling, CI uses `npm ci` for frozen installs.
- **Alternatives considered:** pnpm, yarn — npm chosen for zero-config simplicity.
- **Consequences:** `npm ci` is the documented setup path in CI; `npm install` for local dev.

## D-006 — Defer frontend selection (unchanged)

- **Decision:** Keep `frontend/` as an empty future placeholder.
- **Reason:** Backend API and security contracts should be defined before frontend implementation.
- **Alternatives considered:** UNKNOWN.
- **Consequences:** Do not infer a frontend framework or build pipeline.

## D-007 — Atlas connectivity approach (historical Python context, resolved)

- **Decision:** Document the original Atlas Windows `WinError 5` failure as a connectivity issue, not authentication.
- **Consequences:** Issue was subsequently resolved. MongoDB Atlas connectivity is confirmed working.

## D-008 — Retain startup-gated database check (preserved from Python era)

- **Decision:** Preserve the fail-fast startup database check semantics. `GET /health` returns `{"status":"ok"}` only after DB connection succeeds.
- **Reason:** Validates database reachability before the app serves traffic.
- **Consequences:** Startup fails loudly on misconfigured or unreachable databases.

## D-009 — Repository engineering standards and GitHub Actions CI (updated for JS)

- **Decision:** CI workflow updated from Python/uv to Node.js 20 / npm ci / ESLint / Jest. All other governance files (LICENSE, SECURITY.md, CONTRIBUTING.md, issue/PR templates) retained.
- **Reason:** Automated CI is foundational to production maintainability. CI must match the active stack.
- **Consequences:** All PRs are validated by `npm ci`, `npx eslint src/`, and `npm test`.

## D-010 — Migrate backend from Python/FastAPI/uv to JavaScript/Express/Mongoose/npm

- **Decision:** Replace the entire Python backend with a plain JavaScript Express.js backend. Delete all Python source files. Rebuild the same foundation (health endpoint, DB connection, domain models, test suite) in JS.
- **Reason:** Developer is more comfortable with JavaScript and wants to avoid the Python learning curve at this stage of the project.
- **Alternatives considered:** TypeScript (rejected — simpler without it for now), NestJS (rejected — too opinionated), Fastify/Hono (Express chosen for familiarity).
- **Consequences:** Python 3.14, FastAPI, uv, Pydantic, PyMongo, and Ruff are removed. Node.js, Express, Mongoose, dotenv, Jest, and ESLint are the new stack. All previous D-xxx decisions referencing Python-specific tooling are superseded.

## D-011 — Use ESLint flat config for JavaScript linting

- **Decision:** Use ESLint ^9.8.0 with flat config format (`eslint.config.mjs`) and `@eslint/js` recommended rules.
- **Reason:** Flat config is the current ESLint standard (v9+). Replaces Ruff which was Python-only.
- **Alternatives considered:** Biome (all-in-one, fast — deferred), Prettier (formatting only).
- **Consequences:** Lint is run with `npx eslint src/`. CI enforces zero errors on `src/`.
