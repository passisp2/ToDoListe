"""Minimal Flask-App als Platzhalter für API + Static Serving."""

from pathlib import Path
from flask import Flask, send_from_directory, jsonify

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_DIR),
    static_url_path="",
)


@app.route("/")
def index():
    # Liefert die bestehende index.html aus dem Frontend-Ordner aus.
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


# Beispiel: MariaDB-Anbindung (derzeit auskommentiert, da Backend noch kein DB-Zugriff nutzt)
# import mysql.connector  # falls verwendet, Paket ergänzen
# db_conf = {
#     "host": os.getenv("DB_HOST", "db"),
#     "port": int(os.getenv("DB_PORT", 3306)),
#     "user": os.getenv("DB_USER", "todo_user"),
#     "password": os.getenv("DB_PASSWORD", "todo_pass"),
#     "database": os.getenv("DB_NAME", "todo"),
# }
# def get_connection():
#     return mysql.connector.connect(**db_conf)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
