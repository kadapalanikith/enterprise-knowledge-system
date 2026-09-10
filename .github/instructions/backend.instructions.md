# Backend Engineering Instructions

Path-specific engineering rules for `backend/`.

## Stack & Conventions

- **Runtime**: Python 3.14+ managed via `uv` (`uv.lock` must remain pinned and synchronized).
- **API Framework**: FastAPI with `APIRouter` segregation.
- **Database Driver**: PyMongo asynchronous client (`AsyncMongoClient`). Never use synchronous PyMongo methods in async handlers.
- **Configuration**: Pydantic Settings (`BaseSettings`) loading from `.env` via `SettingsConfigDict`.
- **Formatting & Linting**: Ruff. Code must pass `uv run ruff check .` and `uv run ruff format --check .`.

## Database Rules

- All database access must use the shared asynchronous client handle in `backend.database`.
- Target database is `enterprise_knowledge_system`.
- Lifespan startup must verify database reachability and initialize necessary indexes idempotently.
- Never execute database queries at module import time.

## Testing Standards

- All tests reside in `backend/tests/`.
- Unit tests must be decoupled from live external infrastructure by mocking database calls where appropriate.
- Pytest is configured with `-p no:cacheprovider` in `backend/pyproject.toml` to prevent filesystem permission locks on Windows.
- Every new endpoint, model, or configuration setting must include automated tests.

## Security Constraints

- No secrets, tokens, or raw connection strings in code or logs.
- Sensitive document access and administrative operations must enforce permission checks on the server.
