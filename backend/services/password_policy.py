"""Password policy validation."""

import re

PASSWORD_MIN_LENGTH = 8
SPECIAL_CHAR_PATTERN = re.compile(r"[^A-Za-z0-9]")
DIGIT_PATTERN = re.compile(r"\d")
UPPER_PATTERN = re.compile(r"[A-Z]")
LOWER_PATTERN = re.compile(r"[a-z]")


def validate_password_policy(password: str) -> list[str]:
    errors: list[str] = []

    if len(password) < PASSWORD_MIN_LENGTH:
        errors.append("Password must be at least 8 characters long.")
    if not SPECIAL_CHAR_PATTERN.search(password):
        errors.append("Password must contain at least one special character.")
    if not DIGIT_PATTERN.search(password):
        errors.append("Password must contain at least one digit.")
    if not UPPER_PATTERN.search(password):
        errors.append("Password must contain at least one uppercase letter.")
    if not LOWER_PATTERN.search(password):
        errors.append("Password must contain at least one lowercase letter.")

    return errors
