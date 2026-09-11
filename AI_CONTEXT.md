# AI Context: Enterprise Knowledge System

## Purpose and product vision

This repository is the foundation of a permission-aware enterprise knowledge system. The stated problem is secure discovery of internal knowledge while enforcing role-based access to sensitive documents. The intended product also keeps an auditable trail of knowledge access. The current code does **not** yet implement knowledge ingestion/search, documents, users, roles, audit records, authentication, authorization, or a user interface.

## Current source of truth

- Branch: `main`
- Audited commit: `36e54bd` — `Initial backend foundation`
- Working tree before this documentation change: clean.
- Code is the source of truth. Earlier README language about “authenticated access,” role enforcement, and audit trail describes intent, not delivered functionality.

## Complete implemented stack

| Area | Implemented choice |
| --- | --- |
| Language/runtime | Python 3.14 (`backend/.python-version`, `backend/pyproject.toml`) |
| API | FastAPI 0.141.1+ |
| Server | Uvicorn with standard extras 0.52.4+ |
| Configuration | Pydantic Settings 2.15.0+ and dotenv support |
| Database driver | PyMongo 4.18.1+ asynchronous client |
| Database target | MongoDB; Atlas is configured locally/intended |
| Dependency tooling | uv / `uv.lock`; generated `requirements.txt` exists |
| Development tools | pytest 9.1.1+, Ruff 0.16.6+ |

There is no JavaScript/TypeScript package, frontend framework, Docker configuration, CI configuration, ORM, authentication library, migration framework, test suite, or deployment configuration in the repository.

## Repository structure

```text
README.md                         root onboarding/readme
AI_CONTEXT.md                     detailed migration context
PROJECT_PLAN.md                   plan limited to supported evidence
TASKS.md                          continuation tracker
DECISIONS.md                      recorded decisions
backend/
  .gitignore                      ignores .venv, .env, caches
  .python-version                 3.14
  README.md                       backend-specific initial instructions
  pyproject.toml                  project metadata/dependencies/tool groups
  requirements.txt                uv-generated runtime dependency export
  uv.lock                         locked dependencies
  src/backend/
    __init__.py                   package entry function (prints greeting)
    config.py                     `Settings` with required `mongo_uri`
    database.py                   global AsyncMongoClient and DB handle
    main.py                       FastAPI app, lifespan and `/health`
frontend/                         empty directory; future placeholder only
```

The local `backend/.venv`, caches, and `backend/.env` are ignored and must not be treated as portable project assets.

## System and backend architecture (implemented)

```text
HTTP client
  -> Uvicorn
    -> FastAPI app (`backend/src/backend/main.py`)
      -> lifespan startup: `client.admin.command("ping")`
        -> AsyncMongoClient (`backend/src/backend/database.py`)
          -> MongoDB database `enterprise_knowledge_system`
      -> GET /health -> {"status": "ok"}
```

`backend/src/backend/config.py` instantiates `Settings` at import time. It obtains the required `mongo_uri` setting from environment data with `.env` support. `backend/src/backend/database.py` constructs one module-level `AsyncMongoClient(settings.mongo_uri)` and exposes `database = client["enterprise_knowledge_system"]`. `backend/src/backend/main.py` pings the admin database at application startup and closes the client at shutdown.

Consequently, the app will not complete startup if MongoDB is unavailable; `/health` does not provide a degraded/unready response because the router is unavailable until startup succeeds.

## Frontend architecture

**UNKNOWN / not implemented.** `frontend/` exists but is empty. No frontend stack, routes, build command, API client, pages, or authentication UI has been selected in tracked code.

## Database design
 
 - Database name: `enterprise_knowledge_system` (`backend/src/backend/database.py`).
 - Collections: `users`, `documents`, `audit_logs`.
 - Models/schemas: Implemented in `backend/src/backend/models/` (`user.py`, `document.py`, `audit.py`) with Pydantic v2 schemas (`Create`, `Update`, `InDB`, `Response`).
 - Indexes/migrations: Initial collections designed; indexing strategy will be applied during Phase 2/3 endpoints.

## Authentication and authorization

**Not implemented.** No authentication endpoints, token/session mechanism, identity provider, password handling, current-user dependency, role model, permission checks, or audit-event persistence exists. “Role-based access” is a product requirement only. Do not imply that the current API protects knowledge or enforces permissions.

## API structure

Only one route is registered:

| Method/path | Location | Behavior |
| --- | --- | --- |
| `GET /health` | `backend/src/backend/main.py` | returns `{"status":"ok"}` after successful lifespan startup |

FastAPI automatically exposes `/docs` and OpenAPI metadata. There are no versioned API prefixes, routers, business endpoints, or API tests.

## Environment variables and secrets

| Variable | Required | Meaning |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string consumed by `Settings.mongo_uri`; treat as a secret because it may embed credentials. |

The existing ignored `backend/.env` contains `MONGO_URI` in a space-separated assignment form. Pydantic loaded it in this audit, but use standard `MONGO_URI=...` syntax when recreating configuration. Do not commit `.env`, connection strings, Atlas credentials, API keys, tokens, or passwords.

## Current implementation status

### Completed

- Python/uv backend project scaffold and pinned lockfile.
- FastAPI application titled “Enterprise Knowledge System.”
- Async MongoDB client and named database handle.
- Startup MongoDB ping and client shutdown.
- `GET /health` endpoint.
- Ruff configuration-by-default behavior is clean (`ruff check .` passed).
- Verified MongoDB Atlas reachability: bounded 5-second ping (`{'ok': 1}`) and live lifespan startup/shutdown succeed.
- Pytest configuration in `pyproject.toml` with `pythonpath = ["src"]` and `addopts = "-p no:cacheprovider"`.
- Foundation automated test suite in `backend/tests/` (11 unit tests covering settings, database, lifespan, and health). All 11 tests pass.

### Partially completed

- Project documentation: updated to record verified connectivity, health semantics decision (D-008), and Phase 1 next steps.

### Known problems and discrepancies

1. **Atlas connectivity verified:** The previously observed `ServerSelectionTimeoutError` / `WinError 5` connection denial has been resolved in the current environment; the cluster returned `{'ok': 1}` on a bounded ping.
2. `GET /health` is database-gated at startup via `lifespan`. This is an intentional design choice (D-004, D-008) ensuring misconfigured or unreachable clusters prevent the service from accepting traffic.
3. `backend/pyproject.toml` defines script `backend = "backend:main"`, while `backend/src/backend/__init__.py` has `main()` that only prints `Hello from backend!`. This script does not launch Uvicorn and is not documented as a server command. Use the Uvicorn command above unless deliberately changing packaging behavior.

## Technical decisions supported by code

- Use FastAPI for the API service (D-001).
- Use an asynchronous PyMongo client rather than an ORM (D-002).
- Keep configuration in an environment-backed Pydantic Settings object (D-003).
- Verify database reachability during application lifespan startup (D-004, D-008).
- Use a single database named `enterprise_knowledge_system` (D-002).
- Use `uv` and a committed lockfile for reproducible Python dependencies (D-005).
- Suppress Windows cache permission warnings in pytest via `-p no:cacheprovider` (D-008).

The rationale beyond what is present in README/code is **UNKNOWN**. See [DECISIONS.md](DECISIONS.md) for explicit consequences and non-claims.

## Development commands

From `D:\\enterprise-knowledge-system\\backend`:

```powershell
uv sync
uv run uvicorn backend.main:app --reload
uv run pytest
uv run ruff check .
```

For the local environment, direct `.venv` alternatives can also be used:

```powershell
.\\.venv\\Scripts\\python.exe -m pytest
.\\.venv\\Scripts\\python.exe -m ruff check .
```

## Testing and deployment

- Testing setup: pytest is configured in `backend/pyproject.toml` with `tests/` test directory and `-p no:cacheprovider`. Foundation tests cover settings, database client/handle, lifespan startup/shutdown, the health endpoint, and package entrypoint (12 unit tests, all passing).
- Quality check: Ruff linter (`ruff check .`) and code formatter (`ruff format --check .`) are configured and passing.
- CI/CD: Automated GitHub Actions CI workflow in `.github/workflows/ci.yml` triggers on push and pull requests to `main`, executing checkout, `setup-uv`, Python 3.14 installation, frozen dependency sync, Ruff lint/format checks, and the pytest test suite.
- Deployment: Hosting and production runtime deployment are **UNKNOWN / not implemented** (Phase 5).

## Security considerations

- MongoDB URI is a secret and must remain out of Git; root `.gitignore` and `backend/.gitignore` exclude `.env` and `.env.*` (except `.env.example`).
- Security policy is defined in `SECURITY.md`.
- Current API has no auth or authorization. Do not expose it as a production knowledge API.
- Startup requires a database ping; operational health currently reveals availability only by startup success/failure.
- Before any user/document feature is built, design identity, least-privilege authorization, tenant/org boundaries if needed, audit-event retention, input validation, rate limiting, error handling, secret management, CORS, and database indexes.


## Guidance for the next AI agent

1. Do not build features from product intent alone; first resolve the Atlas reachability blocker and establish a verified local/test database path.
2. Preserve the distinction between current foundation and future RBAC/audit/search claims.
3. Add tests alongside each new capability; begin with startup/config and health behavior after choosing the desired liveness/readiness semantics.
4. Treat any prior conversation decisions not captured in this repository as **UNKNOWN**. No richer plan, schemas, or frontend design were found in Git history: the only commit is the initial backend foundation.
5. Before changing `MONGO_URI`, use standard dotenv assignment syntax and never print it in logs, shell output, commits, or documentation.
