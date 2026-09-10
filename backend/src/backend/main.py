from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.database import client


@asynccontextmanager
async def lifespan(app: FastAPI):
    await client.admin.command("ping")
    yield
    await client.close()


app = FastAPI(title="Enterprise Knowledge System", lifespan=lifespan)


@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok"}
