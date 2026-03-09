"""Tag model."""

from database import db


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64), nullable=False, unique=True, index=True)
    color = db.Column(db.String(7), nullable=False, server_default="#198754")
    created_at = db.Column(
        db.DateTime, nullable=False, server_default=db.func.current_timestamp()
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )

    tasks = db.relationship("Task", secondary="task_tags", back_populates="tags")
