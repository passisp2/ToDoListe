from services.password_hashing import hash_password, verify_password


def test_hash_password_creates_non_plaintext_hash():
    password = "Strong!Pass1"
    password_hash = hash_password(password)

    assert password_hash != password
    assert password_hash.startswith("$argon2")


def test_verify_password_matches_expected_values():
    password_hash = hash_password("Strong!Pass1")

    assert verify_password("Strong!Pass1", password_hash) is True
    assert verify_password("Wrong!Pass1", password_hash) is False
