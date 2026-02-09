# ToDoListe
IT-Projekt: Web-App für persönliche ToDo-Listen

## Tech-Stack
- Frontend: Vanilla JavaScript, HTML, CSS; Bootstrap 5.3.3 per CDN eingebunden.
- Backend: Python + Flask; MariaDB als DB (lokal über Docker), vorerst nur Platzhalter-API.
- Kommunikation: JSON-basierte REST-API.

## Docker-Setup (lokal, Stand: 09.02.2026)
- Services via `docker-compose.yml`:
  - `db` (MariaDB 11.4) mit Volume `db_data`.
  - `api` (Flask-Platzhalter, liefert aktuell `/` und `/api/health`).
  - `db-init` (Profil `init`): führt ein Beispiel-Init-SQL (`db/init.sql`) gegen die DB aus; dient als Setup-Container/Platzhalter.
- Persistenz: benanntes Volume `db_data` für MariaDB-Daten; liegt außerhalb des Git-Repos.
- Konfiguration: `.env` (nicht commiten) mit DB-Credentials; Vorlage in `.env.example`.
- Ports: API auf `8000`, MariaDB auf `3306` (Port-Mapping nur für lokalen Zugriff/Clients).

### Lokale Nutzung
1) Prereqs: Docker + Docker Compose installiert.
2) `.env` anlegen: `cp .env.example .env` und Werte bei Bedarf anpassen.
3) Container starten: `docker compose up --build`.
4) Optionales DB-Init (Platzhalter): `docker compose --profile init up db-init` (führt `db/init.sql` aus).
5) App öffnen: `http://localhost:8000/` (liefert statisches Frontend aus `frontend/`), Healthcheck unter `http://localhost:8000/api/health`.
6) Stoppen: `docker compose down` (Daten bleiben im Volume `db_data` erhalten).

### Hinweise
- Die Flask-App ist nur ein Platzhalter; API-Endpoints und DB-Anbindung kommen noch.
- Für Live-Entwicklung sind `backend/` und `frontend/` in den `api`-Container gebindet (Code-Änderungen ohne Neubau sichtbar; bei neuen Dependencies `docker compose up --build`).
- Echte Secrets gehören nicht in `.env.example` oder ins Repo; lokale `.env` ist in `.gitignore` vorgesehen.
