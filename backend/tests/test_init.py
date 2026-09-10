import importlib.util
from pathlib import Path

import pytest

import backend


def test_package_main_entrypoint(capsys: pytest.CaptureFixture[str]) -> None:
    # Safely load the root package's __init__.py directly to avoid collision with backend.main module
    init_path = Path(backend.__file__)
    spec = importlib.util.spec_from_file_location("backend_package_init", init_path)
    assert spec is not None
    assert spec.loader is not None
    init_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(init_module)

    init_module.main()
    captured = capsys.readouterr()
    assert "Hello from backend!" in captured.out
