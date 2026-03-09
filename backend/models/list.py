"""List and sharing models."""

from database import db


class TodoList(db.Model):
    __tablename__ = "lists"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    slug = db.Column(db.String(64), nullable=False, unique=True, index=True)
    name = db.Column(db.String(120), nullable=False)
    color = db.Column(db.String(7), nullable=False, server_default="#3498db")
    owner_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, server_default=db.func.current_timestamp()
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.current_timestamp(),
        server_onupdate=db.func.current_timestamp(),
    )

    owner = db.relationship("User", backref="owned_lists")
    tasks = db.relationship("Task", back_populates="list")
    shares = db.relationship(
        "ListShare", back_populates="list", cascade="all, delete-orphan"
    )


class ListShare(db.Model):
    __tablename__ = "list_shares"
    __table_args__ = (
        db.UniqueConstraint("list_id", "shared_with_user_id", name="uq_list_user_share"),
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    list_id = db.Column(
        db.Integer, db.ForeignKey("lists.id", ondelete="CASCADE"), nullable=False
    )
    shared_with_user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    permission = db.Column(
        db.Enum("read", "edit", name="list_share_permission"),
        nullable=False,
        server_default="read",
    )
    shared_at = db.Column(
        db.DateTime, nullable=False, server_default=db.func.current_timestamp()
    )

    list = db.relationship("TodoList", back_populates="shares")
    shared_with_user = db.relationship("User", backref="shared_list_links")
