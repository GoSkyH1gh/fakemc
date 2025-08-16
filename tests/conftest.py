import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app
from fastapi.testclient import TestClient
import pytest

@pytest.fixture
def client():
    """Fixture to provide a test client for the API."""
    return TestClient(app)