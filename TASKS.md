# Task Tracker

## Completed

- [x] Create the Python 3.14 / uv backend project in `backend/`.
- [x] Add FastAPI application and `GET /health` in `backend/src/backend/main.py`.
- [x] Add Pydantic Settings-based `MONGO_URI` configuration in `backend/src/backend/config.py`.
- [x] Add async PyMongo client and `enterprise_knowledge_system` database handle in `backend/src/backend/database.py`.
- [x] Ping MongoDB during FastAPI startup and close the client at shutdown.
- [x] Add runtime dependencies and development dependencies (pytest, Ruff).
- [x] Audit and create migration handoff documentation: `AI_CONTEXT.md`, `PROJECT_PLAN.md`, `TASKS.md`, `DECISIONS.md`, and updated root `README.md`.
- [x] Run `ruff check .` via the existing `backend/.venv`; it passed on 2026-09-11.
- [x] Verify MongoDB Atlas reachability: bounded 5-second ping completed successfully with `{'ok': 1}` without disclosing credentials; verified app lifespan startup/shutdown against Atlas.
- [x] Resolve test runner warnings and configure pytest in `backend/pyproject.toml` (`pythonpath = ["src"]`, `addopts = "-p no:cacheprovider"`).
- [x] Establish and document health semantics (D-008): retain startup-gated lifespan DB ping and `/health` returning `{"status": "ok"}`.
- [x] Add foundation test suite in `backend/tests/` covering `Settings`, database client/handle, lifespan startup/shutdown and error handling, and `GET /health`.
- [x] Add `AGENTS.md` as cross-agent persistent instruction layer.
- [x] Complete production engineering audit (D-009): add root `.gitignore`, `backend/.env.example`, `LICENSE` (Apache 2.0), `SECURITY.md`, `CONTRIBUTING.md`, GitHub PR and issue templates, `.github/instructions/backend.instructions.md`, and test `test_init.py` (12 tests total, all passing).
- [x] Add GitHub Actions CI workflow in `.github/workflows/ci.yml` running real stack verification (`setup-uv`, Python 3.14, `uv sync --frozen`, `ruff check`, `ruff format --check`, `pytest`).


- [x] Complete Phase 1 domain and data schema models (`backend/src/backend/models/user.py`, `document.py`, `audit.py`) with Pydantic v2 validation, RBAC role enums, PyMongo alias mappings, and unit tests (`test_models.py`, 19 tests total passing).

## In progress

- [ ] Phase 2: Identity and authentication implementation (password hashing, JWT issuance/validation, security dependencies).

## Blocked

- None.

## Next

- [ ] Add password hashing (`pwdlib`/`bcrypt` or `argon2`) and JWT utility (`pyjwt`) to `backend/`.
- [ ] Implement auth routes (`/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`).
- [ ] Implement FastAPI security dependencies (`get_current_user`, `require_role`).
- [ ] Implement document/knowledge data persistence, CRUD endpoints, and role-based filtering (Phase 3).

## Future

- [ ] Implement auditable access events.
- [ ] Implement protected knowledge discovery/retrieval APIs.
- [ ] Select and implement a frontend in `frontend/` only after backend contracts are defined.
- [ ] Add CI, deployment configuration, secret management, monitoring, and security hardening.

## Continuation notes

- Tested foundation is established with 11 automated unit tests (`uv run pytest` or `python -m pytest`).
- `MONGO_URI` is required. Use `MONGO_URI=...` in a recreated `.env`; do not commit it.
- Atlas connectivity has been verified live and via unit mocks. Next work should proceed with Phase 1 domain and authorization design.

