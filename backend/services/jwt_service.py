"""JWT helpers for access and refresh tokens."""

import os
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from jwt import InvalidTokenError

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.getenv("JWT_SECRET", "dev_jwt_secret_change_me")
ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", "900"))
REFRESH_TOKEN_EXPIRE_SECONDS = int(os.getenv("REFRESH_TOKEN_EXPIRE_SECONDS", "2592000"))
REFRESH_TOKEN_SESSION_EXPIRE_SECONDS = int(
    os.getenv("REFRESH_TOKEN_SESSION_EXPIRE_SECONDS", "86400")
)

ACCESS_COOKIE_NAME = "todo_access_token"
REFRESH_COOKIE_NAME = "todo_refresh_token"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _base_claims(user_id: int, token_type: str, expires_in_seconds: int) -> dict:
    now = _now_utc()
    exp = now + timedelta(seconds=expires_in_seconds)
    return {
        "sub": str(user_id),
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "jti": str(uuid4()),
    }


def create_access_token(user_id: int) -> tuple[str, int]:
    expires_in = ACCESS_TOKEN_EXPIRE_SECONDS
    payload = _base_claims(user_id=user_id, token_type="access", expires_in_seconds=expires_in)
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, expires_in


def create_refresh_token(user_id: int, remember_me: bool) -> tuple[str, int]:
    expires_in = (
        REFRESH_TOKEN_EXPIRE_SECONDS if remember_me else REFRESH_TOKEN_SESSION_EXPIRE_SECONDS
    )
    payload = _base_claims(user_id=user_id, token_type="refresh", expires_in_seconds=expires_in)
    payload["remember_me"] = bool(remember_me)
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, expires_in


def decode_token(token: str, expected_type: str) -> dict | None:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except InvalidTokenError:
        return None
    if payload.get("type") != expected_type:
        return None
    return payload
