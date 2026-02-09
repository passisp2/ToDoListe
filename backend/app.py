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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
