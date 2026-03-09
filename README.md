# ToDoListe
IT-Projekt: Web-App fuer persoenliche ToDo-Listen.

## Tech-Stack
- Frontend: Vanilla JavaScript, HTML, CSS; Bootstrap 5.3.3 per CDN.
- Backend: Python + Flask + SQLAlchemy + Alembic.
- Datenbank: MariaDB (lokal via Docker Compose).
- Kommunikation: JSON-basierte REST-API.

## Docker-Setup (lokal)
- Services in `docker-compose.yml`:
  - `db` (MariaDB 11.4) mit Volume `db_data`.
  - `api` (Flask-App, statisches Frontend + API-Basis).
  - `db-init` (Profil `init`): optionales SQL-Init/Seed ueber `db/init.sql`.
- Persistenz: benanntes Volume `db_data`.
- Konfiguration: `.env` mit DB-Credentials (Vorlage: `.env.example`).
- Ports: API `8000`, MariaDB `3306`.

## Lokale Nutzung
1) Voraussetzungen: Docker + Docker Compose.
2) `.env` anlegen:
   - `cp .env.example .env`
3) Container starten:
   - `docker compose up --build`
4) Migrationen anwenden:
   - `docker compose run --rm api alembic -c alembic.ini upgrade head`
5) Optional SQL-Seed:
   - `docker compose --profile init up db-init`
6) App aufrufen:
   - `http://localhost:8000/`
   - Healthcheck: `http://localhost:8000/api/health`
7) Stoppen:
   - `docker compose down`

## Datenmodell

### Users (Ticket B1)
- `id` (PK, auto-inc)
- `email` (UNIQUE, NOT NULL)
- `password_hash` (NOT NULL)
- `created_at`
- `updated_at`
- `locale`
- `theme`

### Fuer Frontend-Anbindung zusaetzlich
- `lists` (`slug`, `name`, `color`, `owner_user_id`)
- `tasks` (`completed`, `due_date`, `list_id`)
- `tags`
- `task_tags` (M:N zwischen Tasks und Tags)
- `list_shares` (Freigaben mit `permission`)

## Alembic-Workflow
1) Neue Migration:
   - `docker compose run --rm api alembic -c alembic.ini revision -m "beschreibung"`
2) Optional mit Model-Diff:
   - `docker compose run --rm api alembic -c alembic.ini revision --autogenerate -m "beschreibung"`
3) Migration anwenden:
   - `docker compose run --rm api alembic -c alembic.ini upgrade head`
4) Stand pruefen:
   - `docker compose run --rm api alembic -c alembic.ini current`

## Hinweise
- Schema-Aenderungen ueber Alembic durchfuehren.
- `db/init.sql` ist fuer lokales Bootstrap/Seed gedacht.
- Fuer Live-Entwicklung sind `backend/` und `frontend/` in den `api`-Container gemountet.
- Echte Secrets nicht ins Repo committen.
