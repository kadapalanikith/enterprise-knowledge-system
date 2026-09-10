# Enterprise Knowledge System Backend

The FastAPI backend for a permission-aware enterprise knowledge system. It will
provide authenticated access to internal documents, enforce role-based
permissions, and keep an auditable trail of knowledge access.

## Prerequisites

- Python 3.14 or later
- [uv](https://docs.astral.sh/uv/)
- A MongoDB deployment (local MongoDB or MongoDB Atlas)

## Setup

From the `backend` directory:

```powershell
uv sync
```

Create a `.env` file containing your MongoDB connection string:

```env
MONGO_URI=your-mongodb-connection-string
```

Never commit `.env`; it is excluded by `.gitignore`.

## Run the API

```powershell
uv run uvicorn backend.main:app --reload
```

Visit `http://127.0.0.1:8000/docs` for interactive API documentation. Confirm
that `GET /health` returns `{"status":"ok"}`.
