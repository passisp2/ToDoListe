from __future__ import annotations

"""Schemas for todo domain endpoints."""

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ListCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    color: str = "#3498db"


class ListResponse(BaseModel):
    id: str
    name: str
    color: str
    owner: str | None = None
    sharedWith: list[dict[str, Any]] = Field(default_factory=list)


class TagCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    color: str = "#dc3545"


class TagUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    color: str


class TagResponse(BaseModel):
    name: str
    color: str


class TaskCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    title: str
    description: str = ""
    completed: bool = False
    list_slug: str | None = Field(default=None, alias="list")
    due_date: date | None = Field(default=None, alias="dueDate")
    tags: list[str] = Field(default_factory=list)


class TaskUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    list_slug: str | None = Field(default=None, alias="list")
    due_date: date | None = Field(default=None, alias="dueDate")
    tags: list[str] | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    completed: bool
    list: str | None = None
    dueDate: date | None = None
    tags: tuple[str, ...] = ()
    createdAt: datetime
    updatedAt: datetime
