"""Flask auth dependency equivalent for protected routes."""

from functools import wraps

from flask import g, jsonify, request

from schemas.auth import ErrorResponse
from services.jwt_service import ACCESS_COOKIE_NAME, decode_token


def require_access_token(view_func):
    @wraps(view_func)
    def wrapper(*args, **kwargs):
        token = request.cookies.get(ACCESS_COOKIE_NAME)
        if not token:
            return jsonify(ErrorResponse(error="Unauthorized").model_dump()), 401

        payload = decode_token(token, expected_type="access")
        if payload is None:
            return jsonify(ErrorResponse(error="Unauthorized").model_dump()), 401

        g.auth_user_id = int(payload["sub"])
        g.auth_payload = payload
        return view_func(*args, **kwargs)

    return wrapper
