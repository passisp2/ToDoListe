"""Flask-App mit Static Serving und SQLAlchemy-Initialisierung."""

from pathlib import Path

from flask import Flask, jsonify, send_from_directory

from database import build_database_uri, db
from routes import auth_bp, todo_bp

BASE_DIR = Path(__file__).resolve().parent


def resolve_frontend_dir() -> Path:
    """Resolve frontend path for both local and containerized layouts."""
    candidates = [
        BASE_DIR / "frontend",
        BASE_DIR.parent / "frontend",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Frontend directory not found in expected locations")


FRONTEND_DIR = resolve_frontend_dir()


def create_app(test_config: dict | None = None) -> Flask:
    app = Flask(
        __name__,
        static_folder=str(FRONTEND_DIR),
        static_url_path="",
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = build_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    # Import für Model-Registrierung bei App-Start.
    import models  # noqa: F401

    @app.route("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    app.register_blueprint(auth_bp)
    app.register_blueprint(todo_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
