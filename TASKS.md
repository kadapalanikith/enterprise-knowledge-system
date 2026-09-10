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


## In progress

- [ ] Phase 1: Domain and data design (defining documents/knowledge items, user identity, roles, permissions, audit events, and collection/indexing strategy).

## Blocked

- None. Previously recorded Atlas connection blocker and local tool cache issues are resolved.

## Next

- [ ] Define the first domain schema and authorization contract before adding routes. At minimum, explicitly choose identity source, role/permission model, document visibility model, audit-event fields, indexes, and migration strategy.
- [ ] Implement authentication and server-side authorization from an approved design.
- [ ] Implement document/knowledge data model, persistence, validation, and indexes.

## Future

- [ ] Implement auditable access events.
- [ ] Implement protected knowledge discovery/retrieval APIs.
- [ ] Select and implement a frontend in `frontend/` only after backend contracts are defined.
- [ ] Add CI, deployment configuration, secret management, monitoring, and security hardening.

## Continuation notes

- Tested foundation is established with 11 automated unit tests (`uv run pytest` or `python -m pytest`).
- `MONGO_URI` is required. Use `MONGO_URI=...` in a recreated `.env`; do not commit it.
- Atlas connectivity has been verified live and via unit mocks. Next work should proceed with Phase 1 domain and authorization design.

