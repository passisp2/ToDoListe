def register_and_login(client, email="todo.api@example.com", password="Strong!Pass1"):
    register = client.post(
        "/auth/register",
        json={"email": email, "password": password},
    )
    assert register.status_code == 201
    login = client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    assert login.status_code == 200


def test_todo_endpoints_require_auth(client):
    response = client.get("/api/tasks")
    assert response.status_code == 401


def test_create_list_tag_and_task_then_fetch(client):
    register_and_login(client, email="todo.flow@example.com")

    list_response = client.post(
        "/api/lists",
        json={"name": "Privat", "color": "#112233"},
    )
    assert list_response.status_code == 201
    created_list = list_response.get_json()
    assert created_list["id"] == "privat"
    assert created_list["name"] == "Privat"

    tag_response = client.post(
        "/api/tags",
        json={"name": "wichtig", "color": "#ff0000"},
    )
    assert tag_response.status_code == 201
    created_tag = tag_response.get_json()
    assert created_tag["name"] == "wichtig"

    task_response = client.post(
        "/api/tasks",
        json={
            "title": "API Task",
            "description": "persistiert",
            "list": "privat",
            "dueDate": "2026-03-10",
            "tags": ["wichtig"],
        },
    )
    assert task_response.status_code == 201
    created_task = task_response.get_json()
    assert created_task["title"] == "API Task"
    assert created_task["list"] == "privat"
    assert created_task["tags"] == ["wichtig"]

    tasks_response = client.get("/api/tasks")
    assert tasks_response.status_code == 200
    tasks = tasks_response.get_json()
    assert any(task["id"] == created_task["id"] for task in tasks)


def test_update_and_delete_task(client):
    register_and_login(client, email="todo.update@example.com")

    client.post("/api/tags", json={"name": "low", "color": "#00ff00"})
    create_task = client.post(
        "/api/tasks",
        json={"title": "Editier mich", "tags": ["low"]},
    )
    assert create_task.status_code == 201
    task_id = create_task.get_json()["id"]

    update = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Aktualisiert", "completed": True, "tags": []},
    )
    assert update.status_code == 200
    updated_task = update.get_json()
    assert updated_task["title"] == "Aktualisiert"
    assert updated_task["completed"] is True
    assert updated_task["tags"] == []

    delete = client.delete(f"/api/tasks/{task_id}")
    assert delete.status_code == 200

    after_delete = client.get("/api/tasks").get_json()
    assert all(task["id"] != task_id for task in after_delete)


def test_update_tag_renames_tag(client):
    register_and_login(client, email="todo.tag@example.com")

    create_tag = client.post("/api/tags", json={"name": "old", "color": "#111111"})
    assert create_tag.status_code == 201

    update = client.put("/api/tags/old", json={"name": "new", "color": "#222222"})
    assert update.status_code == 200
    updated = update.get_json()
    assert updated["name"] == "new"
    assert updated["color"] == "#222222"
