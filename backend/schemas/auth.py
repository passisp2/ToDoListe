"""Schemas for authentication endpoints."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime


class ErrorResponse(BaseModel):
    error: str


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str
    remember_me: bool = False


class AuthUserResponse(BaseModel):
    id: int
    email: EmailStr
    locale: str | None = None
    theme: str | None = None


class LoginResponse(BaseModel):
    message: str
    user: AuthUserResponse
