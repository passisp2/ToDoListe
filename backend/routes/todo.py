"""Todo domain routes (lists, tags, tasks)."""

from __future__ import annotations

import re

from flask import Blueprint, g, jsonify, request
from pydantic import ValidationError
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from database import db
from models.list import ListShare, TodoList
from models.tag import Tag
from models.task import Task
from schemas.auth import ErrorResponse
from schemas.todo import (
    ListCreateRequest,
    ListResponse,
    TagCreateRequest,
    TagResponse,
    TagUpdateRequest,
    TaskCreateRequest,
    TaskResponse,
    TaskUpdateRequest,
)
from services.auth_dependency import require_access_token

todo_bp = Blueprint("todo", __name__)


def _error(message: str, status_code: int = 400):
    return jsonify(ErrorResponse(error=message).model_dump()), status_code


def _normalize_color(value: str, default: str) -> str:
    color = (value or "").strip()
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", color):
        return default
    return color.lower()


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "liste"


def _list_is_accessible(todo_list: TodoList, user_id: int) -> bool:
    if todo_list.owner_user_id is None:
        return True
    if todo_list.owner_user_id == user_id:
        return True
    return any(share.shared_with_user_id == user_id for share in todo_list.shares)


def _accessible_lists_query(user_id: int):
    return (
        TodoList.query.outerjoin(ListShare, ListShare.list_id == TodoList.id)
        .filter(
            or_(
                TodoList.owner_user_id.is_(None),
                TodoList.owner_user_id == user_id,
                ListShare.shared_with_user_id == user_id,
            )
        )
        .distinct()
    )


def _resolve_list_by_slug(list_slug: str | None, user_id: int) -> TodoList | None:
    if list_slug is None:
        return None
    todo_list = TodoList.query.filter_by(slug=list_slug).first()
    if todo_list is None:
        return None
    if not _list_is_accessible(todo_list, user_id):
        return None
    return todo_list


def _serialize_list(todo_list: TodoList) -> ListResponse:
    owner_email = todo_list.owner.email if todo_list.owner else None
    shared_with = []
    for share in todo_list.shares:
        username = share.shared_with_user.email if share.shared_with_user else str(
            share.shared_with_user_id
        )
        shared_with.append(
            {
                "username": username,
                "permission": share.permission,
                "sharedAt": share.shared_at.isoformat() if share.shared_at else None,
            }
        )
    return ListResponse(
        id=todo_list.slug,
        name=todo_list.name,
        color=todo_list.color,
        owner=owner_email,
        sharedWith=shared_with,
    )


def _serialize_tag(tag: Tag) -> TagResponse:
    return TagResponse(name=tag.name, color=tag.color)


def _serialize_task(task: Task) -> TaskResponse:
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        completed=bool(task.completed),
        list=task.list.slug if task.list else None,
        dueDate=task.due_date,
        tags=sorted(tag.name for tag in task.tags),
        createdAt=task.created_at,
        updatedAt=task.updated_at,
    )


def _validate_and_resolve_tags(tag_names: list[str]) -> tuple[list[Tag] | None, str | None]:
    normalized = sorted({name.strip().lower() for name in tag_names if name and name.strip()})
    if not normalized:
        return [], None

    tags = Tag.query.filter(Tag.name.in_(normalized)).all()
    if len(tags) != len(normalized):
        existing = {tag.name for tag in tags}
        missing = [name for name in normalized if name not in existing]
        return None, f"Unknown tags: {', '.join(missing)}."
    return tags, None


@todo_bp.get("/lists")
@todo_bp.get("/api/lists")
@require_access_token
def list_lists():
    user_id = g.auth_user_id
    lists = _accessible_lists_query(user_id).order_by(TodoList.name.asc()).all()
    body = [_serialize_list(todo_list).model_dump(mode="json") for todo_list in lists]
    return jsonify(body)


@todo_bp.post("/lists")
@todo_bp.post("/api/lists")
@require_access_token
def create_list():
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.")

    try:
        req = ListCreateRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.")

    name = req.name.strip()
    if not name:
        return _error("List name must not be empty.")

    base_slug = _slugify(name)
    slug = base_slug
    suffix = 1
    while TodoList.query.filter_by(slug=slug).first() is not None:
        suffix += 1
        slug = f"{base_slug}-{suffix}"

    todo_list = TodoList(
        slug=slug,
        name=name,
        color=_normalize_color(req.color, "#3498db"),
        owner_user_id=g.auth_user_id,
    )
    db.session.add(todo_list)
    db.session.commit()
    db.session.refresh(todo_list)

    return jsonify(_serialize_list(todo_list).model_dump(mode="json")), 201


@todo_bp.get("/tags")
@todo_bp.get("/api/tags")
@require_access_token
def list_tags():
    tags = Tag.query.order_by(Tag.name.asc()).all()
    body = [_serialize_tag(tag).model_dump(mode="json") for tag in tags]
    return jsonify(body)


@todo_bp.post("/tags")
@todo_bp.post("/api/tags")
@require_access_token
def create_tag():
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.")

    try:
        req = TagCreateRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.")

    name = req.name.strip().lower()
    if not name:
        return _error("Tag name must not be empty.")
    if Tag.query.filter_by(name=name).first() is not None:
        return _error("Tag already exists.")

    tag = Tag(name=name, color=_normalize_color(req.color, "#dc3545"))
    db.session.add(tag)
    db.session.commit()
    db.session.refresh(tag)
    return jsonify(_serialize_tag(tag).model_dump(mode="json")), 201


@todo_bp.put("/tags/<string:tag_name>")
@todo_bp.put("/api/tags/<string:tag_name>")
@require_access_token
def update_tag(tag_name: str):
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.")

    try:
        req = TagUpdateRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.")

    current_name = tag_name.strip().lower()
    tag = Tag.query.filter_by(name=current_name).first()
    if tag is None:
        return _error("Tag not found.", status_code=404)

    new_name = req.name.strip().lower()
    if not new_name:
        return _error("Tag name must not be empty.")
    if new_name != tag.name and Tag.query.filter_by(name=new_name).first() is not None:
        return _error("Tag already exists.")

    tag.name = new_name
    tag.color = _normalize_color(req.color, tag.color or "#dc3545")
    db.session.commit()
    return jsonify(_serialize_tag(tag).model_dump(mode="json"))


@todo_bp.delete("/tags/<string:tag_name>")
@todo_bp.delete("/api/tags/<string:tag_name>")
@require_access_token
def delete_tag(tag_name: str):
    normalized = tag_name.strip().lower()
    tag = Tag.query.filter_by(name=normalized).first()
    if tag is None:
        return _error("Tag not found.", status_code=404)
    db.session.delete(tag)
    db.session.commit()
    return jsonify({"message": "Tag deleted."})


@todo_bp.get("/tasks")
@todo_bp.get("/api/tasks")
@require_access_token
def list_tasks():
    user_id = g.auth_user_id
    tasks = (
        Task.query.join(TodoList, Task.list_id == TodoList.id, isouter=True)
        .outerjoin(ListShare, ListShare.list_id == TodoList.id)
        .filter(
            or_(
                Task.list_id.is_(None),
                TodoList.owner_user_id.is_(None),
                TodoList.owner_user_id == user_id,
                ListShare.shared_with_user_id == user_id,
            )
        )
        .order_by(Task.created_at.desc(), Task.id.desc())
        .all()
    )
    body = [_serialize_task(task).model_dump(mode="json") for task in tasks]
    return jsonify(body)


@todo_bp.post("/tasks")
@todo_bp.post("/api/tasks")
@require_access_token
def create_task():
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.")

    try:
        req = TaskCreateRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.")

    title = req.title.strip()
    if not title:
        return _error("Task title must not be empty.")

    target_list = _resolve_list_by_slug(req.list_slug, g.auth_user_id)
    if req.list_slug is not None and target_list is None:
        return _error("List not found.", status_code=404)

    tags, tag_error = _validate_and_resolve_tags(req.tags)
    if tag_error:
        return _error(tag_error)

    task = Task(
        title=title,
        description=req.description or "",
        completed=req.completed,
        due_date=req.due_date,
        list_id=target_list.id if target_list else None,
    )
    if tags is not None:
        task.tags = tags

    db.session.add(task)
    db.session.commit()
    db.session.refresh(task)
    return jsonify(_serialize_task(task).model_dump(mode="json")), 201


@todo_bp.put("/tasks/<int:task_id>")
@todo_bp.put("/api/tasks/<int:task_id>")
@require_access_token
def update_task(task_id: int):
    payload = request.get_json(silent=True)
    if payload is None:
        return _error("Invalid or missing JSON body.")

    try:
        req = TaskUpdateRequest.model_validate(payload)
    except ValidationError:
        return _error("Invalid request payload.")

    task = db.session.get(Task, task_id)
    if task is None:
        return _error("Task not found.", status_code=404)

    # Current task must be visible to current user.
    if task.list and not _list_is_accessible(task.list, g.auth_user_id):
        return _error("Task not found.", status_code=404)

    fields_set = req.model_fields_set

    if "title" in fields_set:
        title = (req.title or "").strip()
        if not title:
            return _error("Task title must not be empty.")
        task.title = title
    if "description" in fields_set:
        task.description = req.description or ""
    if "completed" in fields_set:
        task.completed = bool(req.completed)
    if "list_slug" in fields_set:
        target_list = _resolve_list_by_slug(req.list_slug, g.auth_user_id)
        if req.list_slug is not None and target_list is None:
            return _error("List not found.", status_code=404)
        task.list_id = target_list.id if target_list else None
    if "due_date" in fields_set:
        task.due_date = req.due_date
    if "tags" in fields_set:
        tags, tag_error = _validate_and_resolve_tags(req.tags or [])
        if tag_error:
            return _error(tag_error)
        task.tags = tags or []

    db.session.commit()
    db.session.refresh(task)
    return jsonify(_serialize_task(task).model_dump(mode="json"))


@todo_bp.delete("/tasks/<int:task_id>")
@todo_bp.delete("/api/tasks/<int:task_id>")
@require_access_token
def delete_task(task_id: int):
    task = db.session.get(Task, task_id)
    if task is None:
        return _error("Task not found.", status_code=404)
    if task.list and not _list_is_accessible(task.list, g.auth_user_id):
        return _error("Task not found.", status_code=404)

    try:
        db.session.delete(task)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _error("Task could not be deleted.", status_code=400)

    return jsonify({"message": "Task deleted."})
