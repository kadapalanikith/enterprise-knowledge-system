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

- Added `backend/src/backend/models/user.py`, `document.py`, and `audit.py` defining domain schemas, role enums (`UserRole`), audit actions (`AuditAction`), and Pydantic v2 validation.
- Added `email-validator` dependency for `EmailStr` RFC validation.
- Added `backend/tests/test_models.py`, bringing test suite to 19 unit tests with 100% passing results and full coverage.
- Formatted and linted all files with Ruff.

## Exact current blocker

**None.** Foundation and domain models are verified.

## What was tested

- `uv run ruff check .` — passed (0 errors).
- `uv run ruff format --check .` — passed (15 files checked, 0 unformatted).
- `uv run pytest` — 19 passed in 0.62s (0 failures, 0 warnings).


## Do not change these assumptions without an explicit design decision

- Do not expose or commit `MONGO_URI`, credentials, tokens, passwords, or `backend/.env`.
- Preserve the current async FastAPI + async PyMongo + Pydantic Settings + uv foundation.
- Keep domain models separated into `Create`, `Update`, `InDB`, and `Response` schemas to avoid credential leaks.

## Immediate next task

Phase 2 — Identity and authentication: Add password hashing, JWT creation/verification, security dependencies (`get_current_user`, `require_role`), and authentication endpoints.

## Recommended remaining-work order

1. Implement authentication and server-side authorization with tests (Phase 2).
2. Implement protected knowledge/document workflows and discovery/search with authorization filtering (Phase 3).
3. Choose and build the frontend against stable protected API contracts (Phase 4).
4. Add CI, deployment configuration, monitoring, secret management, and production security hardening (Phase 5).

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
