from services.password_policy import validate_password_policy


def test_password_policy_accepts_valid_password():
    errors = validate_password_policy("Strong!Pass1")
    assert errors == []


def test_password_policy_rejects_invalid_password():
    errors = validate_password_policy("weak")
    assert len(errors) == 4
    assert "at least 8 characters" in errors[0]
