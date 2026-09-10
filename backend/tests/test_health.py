import pytest
from fastapi.routing import APIRoute

from backend.main import app, health_check


@pytest.mark.anyio
async def test_health_check_handler() -> None:
    response = await health_check()
    assert response == {"status": "ok"}


def test_health_route_registration() -> None:
    routes = [route for route in app.routes if isinstance(route, APIRoute)]
    health_routes = [r for r in routes if r.path == "/health"]

    assert len(health_routes) == 1
    health_route = health_routes[0]
    assert "GET" in health_route.methods
    assert "system" in health_route.tags


def test_app_metadata() -> None:
    assert app.title == "Enterprise Knowledge System"
