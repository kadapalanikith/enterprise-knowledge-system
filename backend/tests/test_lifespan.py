from unittest.mock import AsyncMock, patch

import pytest
from fastapi import FastAPI

from backend.main import lifespan


@pytest.mark.anyio
async def test_lifespan_success() -> None:
    test_app = FastAPI()
    mock_client = AsyncMock()
    mock_client.admin.command = AsyncMock(return_value={"ok": 1})
    mock_client.close = AsyncMock()

    with patch("backend.main.client", mock_client):
        async with lifespan(test_app):
            mock_client.admin.command.assert_awaited_once_with("ping")
            assert mock_client.close.await_count == 0

        mock_client.close.assert_awaited_once()


@pytest.mark.anyio
async def test_lifespan_database_ping_failure() -> None:
    test_app = FastAPI()
    mock_client = AsyncMock()
    mock_client.admin.command = AsyncMock(
        side_effect=RuntimeError("Database unreachable")
    )
    mock_client.close = AsyncMock()

    with patch("backend.main.client", mock_client):
        with pytest.raises(RuntimeError, match="Database unreachable"):
            async with lifespan(test_app):
                pass

        assert mock_client.close.await_count == 0
