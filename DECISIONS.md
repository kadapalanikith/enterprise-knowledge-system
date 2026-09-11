# Decisions

## Recording scope

Only decisions evidenced in current code/documentation are recorded here. The repository contains one initial commit and no design record, so rationale not expressed by the code or README is marked **UNKNOWN** rather than reconstructed.

## D-001 — Use FastAPI for the backend API

- **Decision:** Build the backend with FastAPI (`backend/src/backend/main.py`).
- **Reason:** The repository describes a backend API and declares FastAPI as the application dependency. Further rationale is UNKNOWN.
- **Alternatives considered:** UNKNOWN; none recorded.
- **Consequences:** API routes, lifecycle, OpenAPI docs, and request handling follow FastAPI conventions. `/docs` is automatically available when the app starts.

## D-002 — Use asynchronous PyMongo against MongoDB

- **Decision:** Use `pymongo.AsyncMongoClient` in `backend/src/backend/database.py` and select database `enterprise_knowledge_system`.
- **Reason:** MongoDB is the chosen persistence target; the async client matches the async FastAPI application. No deeper comparison is recorded.
- **Alternatives considered:** UNKNOWN; no ORM or alternate database is present.
- **Consequences:** Future persistence code should use async PyMongo patterns or intentionally revise this decision. No schemas, migrations, or collections exist yet.

## D-003 — Load MongoDB configuration from environment-backed settings

- **Decision:** Define required `mongo_uri` through Pydantic Settings with `.env` support in `backend/src/backend/config.py`; its environment key is `MONGO_URI`.
- **Reason:** Keeps connection details outside tracked source; `backend/.gitignore` excludes `.env`.
- **Alternatives considered:** Hard-coded connection data is not used; other options are UNKNOWN.
- **Consequences:** Every runtime needs a valid `MONGO_URI`. It must remain secret. Standard `MONGO_URI=...` syntax is recommended when configuring a new environment.

## D-004 — Fail application startup if MongoDB cannot be pinged

- **Decision:** FastAPI lifespan runs `await client.admin.command("ping")` before serving, and closes the client at shutdown.
- **Reason:** The original README calls this a MongoDB startup health check. This validates database reachability before the app accepts requests.
- **Alternatives considered:** Starting independently with a separate readiness endpoint, lazy connection, retries, or degraded mode are not implemented/recorded.
- **Consequences:** The API and `/health` are unavailable during an Atlas outage or connectivity failure. This is currently exposed by the local Windows connection-denied blocker.

## D-005 — Use uv and lock dependencies

- **Decision:** Manage the backend with uv, `pyproject.toml`, and committed `uv.lock`; retain generated `requirements.txt`.
- **Reason:** Evidenced by project files and backend README; a specific rationale is UNKNOWN.
- **Alternatives considered:** UNKNOWN.
- **Consequences:** `uv sync` is the documented setup path. `requirements.txt` is an exported runtime dependency list, not the primary declaration.

## D-006 — Defer frontend selection

- **Decision:** Keep `frontend/` as an empty future placeholder.
- **Reason:** Root README labels it as a future web interface; no frontend code or stack is committed.
- **Alternatives considered:** UNKNOWN.
- **Consequences:** Do not infer a frontend framework or build pipeline. Backend API/security contracts should be designed before frontend implementation.

## D-007 — Document the Atlas failure as connectivity, not confirmed authentication

- **Decision:** Record the current Atlas issue as a pre-authentication connection failure.
- **Reason:** The audited direct ping reported `ServerSelectionTimeoutError` with Windows `WinError 5: Access is denied` for all cluster sockets and no primary selected. It did not return an authentication rejection.
- **Alternatives considered:** Calling it a bad password/username was rejected because the evidence does not support it.
- **Consequences:** Resolve network/firewall/proxy/IP-allowlist access before changing credentials. Keep the URI and credentials out of source and documentation.

## D-008 — Retain startup-gated database ping and add cache-safe test suite

- **Decision:** Retain the fail-fast lifespan database ping that validates MongoDB reachability upon app start, maintain `GET /health` returning `{"status": "ok"}`, configure pytest with `addopts = "-p no:cacheprovider"` to avoid Windows filesystem permission warnings, and add a comprehensive unit test suite with mocked client lifecycles and settings validation.
- **Reason:** Atlas connectivity was tested and confirmed working (`{'ok': 1}`). Keeping the startup ping guarantees that misconfigured database environments or unreachable clusters fail loudly at boot time before serving traffic. Mocking the client during unit tests allows rapid, deterministic verification of both successful lifespans and database failure propagation without requiring live network access in test runs.
- **Alternatives considered:** Separate unauthenticated `/health/live` and `/health/ready` endpoints were considered; deferred to Phase 5 production readiness when container orchestration requirements are defined.
- **Consequences:** Application startup remains dependent on database reachability. Automated testing covers `Settings`, `database`, `lifespan`, and `/health` with 100% passing results and no filesystem cache conflicts.

## D-009 — Establish production repository engineering standards and GitHub Actions CI

- **Decision:** Standardize repository governance and quality hygiene: add root `.gitignore`, `.env.example`, `LICENSE` (Apache 2.0), `SECURITY.md`, `CONTRIBUTING.md`, `.github/workflows/ci.yml` (automated lint, format check, and tests on push/PR via `setup-uv`), issue/PR templates, and `.github/instructions/backend.instructions.md`.
- **Reason:** Align repository practices with production software engineering standards without adding bloated or speculative framework dependencies.
- **Alternatives considered:** Omitting GitHub templates or CI workflow was rejected because automated CI and clear contribution contracts are foundational to production maintainability.
- **Consequences:** All PRs and commits are validated by automated CI matching local commands (`uv sync --frozen`, `ruff check`, `ruff format --check`, `pytest`). Security guidelines and cross-agent instruction layers are clearly partitioned.

## D-010 — Implement explicit domain schema layer with Pydantic v2 and PyMongo alias compatibility

- **Decision:** Implement domain schema models in `backend/src/backend/models/` for users (`user.py`), documents (`document.py`), and audit logs (`audit.py`) using Pydantic v2, `email-validator` for `EmailStr`, `ConfigDict(populate_by_name=True)`, string-backed enums (`UserRole`, `AuditAction`), and `_id` alias mappings.
- **Reason:** Separating `Create`, `Update`, `InDB`, and `Response` representations prevents sensitive fields (such as `hashed_password`) from leaking into API output while ensuring type safety, request validation, and clean serialization with MongoDB.
- **Alternatives considered:** Using raw dicts or an ORM/ODM like Beanie was considered; rejected to preserve lightweight direct async PyMongo patterns and avoid unnecessary runtime overhead.
- **Consequences:** All incoming requests, database persistence layers, and API response serializers use validated Pydantic schemas. 19 unit tests verify validation rules, defaults, and serialization behavior.
