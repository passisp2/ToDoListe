"""SQLAlchemy setup and MariaDB connection helpers."""

import os
from urllib.parse import quote_plus

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

db = SQLAlchemy(metadata=MetaData(naming_convention=NAMING_CONVENTION))


def build_database_uri() -> str:
    host = os.getenv("DB_HOST", "db")
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "todo")
    user = quote_plus(os.getenv("DB_USER", "todo_user"))
    password = quote_plus(os.getenv("DB_PASSWORD", "todo_pass"))
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}?charset=utf8mb4"
