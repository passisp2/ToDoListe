"""Authentication routes."""

import os

from flask import Blueprint, Response, g, jsonify, request
from pydantic import ValidationError
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from database import db
from models.user import User
from schemas.auth import (
    AuthUserResponse,
    ErrorResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
)
from services.auth_dependency import require_access_token
from services.jwt_service import (
    ACCESS_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from services.password_hashing import hash_password, verify_password
from services.password_policy import validate_password_policy

auth_bp = Blueprint("auth", __name__)
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "Lax")


def _error(message: str, status_code: int = 400):
    return jsonify(ErrorResponse(error=message).model_dump()), status_code


def _serialize_user(user: User) -> AuthUserResponse:
    return AuthUserResponse(
        id=user.id,
        email=user.email,
        locale=user.locale,
        theme=user.theme,
    )


def _set_auth_cookies(
    response: Response, *, user_id: int, remember_me: bool, set_refresh_cookie: bool = True
) -> Response:
    access_token, access_expires = create_access_token(user_id=user_id)
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        access_token,
        max_age=access_expires,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        path="/",
    )

    if set_refresh_cookie:
        refresh_token, refresh_expires = create_refresh_token(
            user_id=user_id, remember_me=remember_me
        )
        refresh_max_age = refresh_expires if remember_me else None
        response.set_cookie(
            REFRESH_COOKIE_NAME,
            refresh_token,
            max_age=refresh_max_age,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            path="/",
        )
    return response


@auth_bp.post("/auth/register")
@auth_bp.post("/api/auth/register")
def register():
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.")

    try:
        req = RegisterRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.")

    normalized_email = req.email.strip().lower()
    policy_errors = validate_password_policy(req.password)
    if policy_errors:
        return _error(" ".join(policy_errors))

    existing_user = User.query.filter(func.lower(User.email) == normalized_email).first()
    if existing_user is not None:
        return _error("Email is already registered.")

    user = User(
        email=normalized_email,
        password_hash=hash_password(req.password),
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _error("Email is already registered.")

    db.session.refresh(user)
    response = RegisterResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at,
    )
    return jsonify(response.model_dump(mode="json")), 201


@auth_bp.post("/auth/login")
@auth_bp.post("/api/auth/login")
def login():
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.", status_code=400)

    try:
        req = LoginRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.", status_code=400)

    normalized_email = req.email.strip().lower()
    user = User.query.filter(func.lower(User.email) == normalized_email).first()
    if user is None:
        return _error("Invalid credentials.", status_code=401)

    if not verify_password(req.password, user.password_hash):
        return _error("Invalid credentials.", status_code=401)

    response_body = LoginResponse(message="Login successful.", user=_serialize_user(user))
    response = jsonify(response_body.model_dump(mode="json"))
    return _set_auth_cookies(response, user_id=user.id, remember_me=req.remember_me)


@auth_bp.post("/auth/refresh")
@auth_bp.post("/api/auth/refresh")
def refresh():
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_token:
        return _error("Unauthorized.", status_code=401)

    payload = decode_token(refresh_token, expected_type="refresh")
    if payload is None:
        return _error("Unauthorized.", status_code=401)

    user_id = int(payload["sub"])
    remember_me = bool(payload.get("remember_me", False))
    user = db.session.get(User, user_id)
    if user is None:
        return _error("Unauthorized.", status_code=401)

    response = jsonify({"message": "Token refreshed."})
    return _set_auth_cookies(
        response,
        user_id=user.id,
        remember_me=remember_me,
        set_refresh_cookie=False,
    )


@auth_bp.get("/auth/me")
@auth_bp.get("/api/auth/me")
@require_access_token
def me():
    user = db.session.get(User, g.auth_user_id)
    if user is None:
        return _error("Unauthorized.", status_code=401)
    return jsonify(_serialize_user(user).model_dump(mode="json"))


@auth_bp.post("/auth/logout")
@auth_bp.post("/api/auth/logout")
def logout():
    response = jsonify({"message": "Logged out."})
    response.delete_cookie(ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/")
    return response
