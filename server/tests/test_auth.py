# tests/test_auth.py
import pytest
from run import app  # ✅ Use run.py since that's your working entry

@pytest.fixture
def client():
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "JWT_SECRET_KEY": "test-secret"
    })
    with app.test_client() as client:
        with app.app_context():
            from app.database import db
            db.create_all()
        yield client

def test_register_user(client):
    res = client.post("/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "test123",
        "role": "seeker"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email"] == "test@example.com"
