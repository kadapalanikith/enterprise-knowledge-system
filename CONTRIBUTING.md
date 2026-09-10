# Contributing to Enterprise Knowledge System

Thank you for contributing to the Enterprise Knowledge System. This document provides guidelines for development, code standards, testing, and pull requests.

---

## Development Prerequisites

- **Python**: 3.14 or later
- **Dependency Manager**: [uv](https://docs.astral.sh/uv/) (v0.12+)
- **Database**: MongoDB 7.0+ or MongoDB Atlas

---

## Local Development Setup

1. **Clone the repository**:
   ```powershell
   git clone https://github.com/kadapalanikith/enterprise-knowledge-system.git
   cd enterprise-knowledge-system
   ```

2. **Install dependencies**:
   ```powershell
   cd backend
   uv sync
   ```

3. **Configure environment**:
   Copy `.env.example` to `.env`:
   ```powershell
   cp .env.example .env
   ```
   Set `MONGO_URI` to a reachable MongoDB deployment. Never commit `.env` or credentials.

4. **Start the backend development server**:
   ```powershell
   uv run uvicorn backend.main:app --reload
   ```
   Access OpenAPI documentation at `http://127.0.0.1:8000/docs`.

---

## Validation Commands

Before committing or opening a pull request, run all checks from `backend/`:

```powershell
# 1. Run linter
uv run ruff check .

# 2. Run format check
uv run ruff format --check .

# 3. Run automated tests
uv run pytest
```

---

## Commit & Branch Conventions

- **Branch naming**:
  - `feat/feature-name`
  - `fix/bug-description`
  - `docs/documentation-update`
  - `refactor/component-name`

- **Commit messages**: Use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add document classification schema`
  - `fix: resolve lifespan event loop binding`
  - `docs: update security policy`
  - `test: add settings validation unit tests`
  - `chore: update dependencies in lockfile`

---

## Persistent Project Memory Protocol

When adding features, modifying schemas, or changing architecture, update the relevant documentation in the same commit:
- `AI_CONTEXT.md`: Architecture, stack, collections, models.
- `TASKS.md`: Task status and next steps.
- `DECISIONS.md`: Record significant architectural decisions (`D-xxx`).
- `HANDOFF.md`: Immediate continuation state.
- `AGENTS.md`: Agent instruction rules.
