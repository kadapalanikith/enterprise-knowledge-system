# Handoff to the Next AI Agent

## What this project is

This is an early-stage **Enterprise Knowledge System**. Its stated goal is to let employees securely find internal knowledge, enforce role-based access to sensitive documents, and keep an auditable access trail. At present, it is only a backend foundation; those product capabilities are not implemented yet.

## Current state

- Branch/starting point: `main`, committed foundation `36e54bd` (`Initial backend foundation`).
- The only implemented application feature is a FastAPI health endpoint.
- `frontend/` is an empty placeholder; no frontend stack has been chosen.
- There are no database collections, models, indexes, migrations, authentication, authorization, audit events, document workflows, search, tests, CI, or deployment configuration.
- Read [AI_CONTEXT.md](AI_CONTEXT.md), [TASKS.md](TASKS.md), [PROJECT_PLAN.md](PROJECT_PLAN.md), and [DECISIONS.md](DECISIONS.md) before making architectural changes.

## Already built

- Python 3.14 / uv backend project in `backend/`.
- FastAPI app in `backend/src/backend/main.py`.
- `GET /health`, returning `{"status":"ok"}` after successful startup.
- Pydantic Settings configuration in `backend/src/backend/config.py`.
- Async PyMongo client and `enterprise_knowledge_system` database handle in `backend/src/backend/database.py`.
- Startup MongoDB `ping` and shutdown client close.
- Dependency lockfile plus pytest and Ruff development dependencies.

## Most recent work

- Added `AGENTS.md` persistent cross-agent instruction layer.
- Completed production repository engineering audit (D-009): added root `.gitignore`, `backend/.env.example`, `LICENSE` (Apache 2.0), `SECURITY.md`, `CONTRIBUTING.md`, GitHub PR and issue templates, and `.github/instructions/backend.instructions.md`.
- Added GitHub Actions CI workflow in `.github/workflows/ci.yml` running real stack verification (`setup-uv`, Python 3.14, `uv sync --frozen`, `ruff check`, `ruff format --check`, `pytest`).
- Added `backend/tests/test_init.py`, bringing test suite to 12 unit tests with 100% passing results and full source coverage.

## Exact current blocker

**None.** Atlas connectivity, local tools, and CI configuration are established and verified.

## What was tested

- `uv run ruff check .` — passed (0 errors).
- `uv run ruff format --check .` — passed (11 files checked, 0 unformatted).
- `uv run pytest` — 12 passed in 0.72s (0 failures, 0 warnings).
- Bounded MongoDB Atlas ping (`{'ok': 1}`) and live application lifespan context enter/exit — passed.


## Do not change these assumptions without an explicit design decision

- Do not claim existing authentication, RBAC, auditing, documents, search, or frontend functionality; none exists.
- Do not expose or commit `MONGO_URI`, credentials, tokens, passwords, or `backend/.env`.
- Preserve the current async FastAPI + async PyMongo + Pydantic Settings + uv foundation unless there is a deliberate replacement decision.
- Preserve database name `enterprise_knowledge_system` unless a migration plan is documented.
- Do not build product features until database connectivity and the authorization/data design are defined.

## Immediate next task

Phase 1 — Domain and data design: Define the domain schema, collection and index strategy, identity source, authorization rules (roles and permissions), and audit-event model before adding business routes.

## Recommended remaining-work order

1. Define the domain schema, collection/index strategy, identity source, authorization rules, and audit-event model (Phase 1).
2. Implement authentication and server-side authorization with tests (Phase 2).
3. Implement protected knowledge/document workflows and discovery/search with authorization filtering (Phase 3).
4. Choose and build the frontend against stable protected API contracts (Phase 4).
5. Add CI, deployment configuration, monitoring, secret management, and production security hardening (Phase 5).

## Inspect these files first

1. [AI_CONTEXT.md](AI_CONTEXT.md) — detailed implementation and migration facts.
2. [TASKS.md](TASKS.md) — current actionable tracker.
3. [backend/src/backend/main.py](backend/src/backend/main.py) — app lifespan and health endpoint.
4. [backend/src/backend/config.py](backend/src/backend/config.py) — required environment setting.
5. [backend/src/backend/database.py](backend/src/backend/database.py) — database client and name.
6. [backend/pyproject.toml](backend/pyproject.toml) — dependencies and Python version.

## Commands

Run from `backend/` after securely configuring `MONGO_URI` in an ignored `.env` using `MONGO_URI=...` syntax:

```powershell
uv sync
uv run uvicorn backend.main:app --reload
uv run ruff check .
uv run pytest
```

If this workstation’s uv cache remains inaccessible, the existing local virtual environment can run checks:

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m pytest
```

## How to verify it still works

1. With a reachable MongoDB deployment, start Uvicorn successfully.
2. Open `http://127.0.0.1:8000/docs`.
3. Request `GET http://127.0.0.1:8000/health`; expect `{"status":"ok"}`.
4. Run Ruff; it should pass.
5. Run pytest. Currently, zero tests is the known baseline; add tests before treating this as a healthy test suite.

## Assumptions to preserve

- Code is the current source of truth; historical rationale absent from the repository is `UNKNOWN`.
- The current local `.env` is ignored and non-portable. Recreate secrets securely rather than transferring them in Git.
- The connection failure occurs before authentication; do not diagnose it as bad credentials without new evidence.
- The root documentation files are the complete retained context from this Codex handoff. Any prior conversation context not represented there should be treated as unavailable.
