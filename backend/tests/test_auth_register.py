from models.user import User
from services.password_hashing import verify_password


def test_register_success_returns_201_and_persists_user(client, app):
    response = client.post(
        "/auth/register",
        json={"email": "new.user@example.com", "password": "Strong!Pass1"},
    )

    assert response.status_code == 201
    body = response.get_json()
    assert body["email"] == "new.user@example.com"
    assert "id" in body
    assert "created_at" in body

    with app.app_context():
        user = User.query.filter_by(email="new.user@example.com").first()
        assert user is not None
        assert verify_password("Strong!Pass1", user.password_hash) is True


def test_register_rejects_weak_password(client):
    response = client.post(
        "/auth/register",
        json={"email": "weak.user@example.com", "password": "weakpass"},
    )

    assert response.status_code == 400
    body = response.get_json()
    assert "Password must contain at least one special character." in body["error"]


def test_register_rejects_duplicate_email(client):
    first = client.post(
        "/auth/register",
        json={"email": "duplicate@example.com", "password": "Strong!Pass1"},
    )
    second = client.post(
        "/auth/register",
        json={"email": "duplicate@example.com", "password": "Strong!Pass1"},
    )

    assert first.status_code == 201
    assert second.status_code == 400
    assert second.get_json()["error"] == "Email is already registered."


def test_register_rejects_invalid_payload(client):
    response = client.post("/auth/register", json={"email": "not-an-email"})

    assert response.status_code == 400
    assert response.get_json()["error"] == "Invalid request payload."
