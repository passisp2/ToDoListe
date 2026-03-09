"""Task model and tag association table."""

from database import db

task_tags = db.Table(
    "task_tags",
    db.Column(
        "task_id", db.Integer, db.ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True
    ),
    db.Column(
        "tag_id", db.Integer, db.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    ),
    db.Column(
        "created_at", db.DateTime, nullable=False, server_default=db.func.current_timestamp()
    ),
)


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, nullable=False, server_default=db.false())
    due_date = db.Column(db.Date, nullable=True)
    list_id = db.Column(db.Integer, db.ForeignKey("lists.id"), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, server_default=db.func.current_timestamp()
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )

    list = db.relationship("TodoList", back_populates="tasks")
    tags = db.relationship("Tag", secondary=task_tags, back_populates="tasks")
