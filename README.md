# Enterprise Knowledge System

An early-stage, permission-aware enterprise knowledge-system backend. Its intended purpose is to let employees find internal knowledge while enforcing role-based access to sensitive documents and maintaining an auditable record of access. The repository currently contains only the backend foundation; no application features, document model, authentication, authorization enforcement, audit trail, or frontend have been implemented.

For the complete, code-grounded handoff, read [AI_CONTEXT.md](AI_CONTEXT.md). The current work tracker is [TASKS.md](TASKS.md), and recorded decisions are in [DECISIONS.md](DECISIONS.md).

## Stack

- Python 3.14
- FastAPI
- PyMongo asynchronous client (`AsyncMongoClient`)
- MongoDB / MongoDB Atlas (intended persistence)
- Pydantic Settings
- Uvicorn
- uv for dependency and environment management

## Repository layout

```text
backend/                 FastAPI service and its Python project
  src/backend/main.py    application and /health endpoint
  src/backend/config.py  environment-backed settings
  src/backend/database.py MongoDB client and database handle
frontend/                empty placeholder for a future web interface
```

## Setup

Prerequisites: Python 3.14+ and [uv](https://docs.astral.sh/uv/).

```powershell
cd backend
uv sync
```

Create `backend/.env` with a MongoDB connection string. Use this portable form (do not commit the file):

```env
MONGO_URI=your-mongodb-connection-string
```

`MONGO_URI` is required by `backend/src/backend/config.py`. The existing local `.env` is ignored by Git and contains a value using space-separated rather than equals-separated syntax; it is parsed in the current environment, but equals syntax is the recommended form for a new setup.

## Run

From `backend/`:

```powershell
uv run uvicorn backend.main:app --reload
```

The API documentation is at `http://127.0.0.1:8000/docs`. The only current endpoint is `GET /health`, which returns `{"status":"ok"}` only after the application lifespan successfully pings MongoDB at startup.

There is no frontend to run yet.

## Database setup and verified Atlas connectivity

The service creates an asynchronous MongoDB client from `MONGO_URI` and selects the `enterprise_knowledge_system` database. It creates no collections, indexes, or seed data.

Database connectivity against MongoDB Atlas has been verified with a bounded ping (`{'ok': 1}`). App lifespan startup and shutdown were verified live against Atlas. Never commit or disclose credentials or connection strings in documentation or version control.

## Testing and quality checks

```powershell
cd backend
uv run pytest
uv run ruff check .
```

A foundation test suite of 11 automated unit tests is located in `backend/tests/` covering settings validation, database handles, lifespan startup/shutdown lifecycle and failure handling, and `/health`. Pytest is configured in `pyproject.toml` with `-p no:cacheprovider` to run cleanly across environments. Ruff checks pass with 0 errors.

## Current status

Phase 0 foundation stabilization is complete. The FastAPI/MongoDB startup lifecycle, configuration object, database handle, and automated tests are in place. The next phase is Phase 1 (Domain and data design). See [PROJECT_PLAN.md](PROJECT_PLAN.md) and [TASKS.md](TASKS.md).

