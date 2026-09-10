import pytest
from pydantic import ValidationError

from backend.config import Settings, settings


def test_settings_direct_instantiation() -> None:
    custom_settings = Settings(mongo_uri="mongodb://localhost:27017", _env_file=None)
    assert custom_settings.mongo_uri == "mongodb://localhost:27017"


def test_settings_from_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MONGO_URI", "mongodb://test-cluster:27017")
    env_settings = Settings(_env_file=None)
    assert env_settings.mongo_uri == "mongodb://test-cluster:27017"


def test_settings_missing_mongo_uri(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("MONGO_URI", raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


def test_module_settings_instance() -> None:
    assert isinstance(settings, Settings)
    assert isinstance(settings.mongo_uri, str)
    assert len(settings.mongo_uri) > 0
