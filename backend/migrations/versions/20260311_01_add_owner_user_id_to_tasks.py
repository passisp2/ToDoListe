"""add owner_user_id to tasks

Revision ID: 20260311_01
Revises: 20260309_01
Create Date: 2026-03-11 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260311_01"
down_revision: Union[str, None] = "20260309_01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "tasks",
        sa.Column("owner_user_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_tasks_owner",
        "tasks",
        "users",
        ["owner_user_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_tasks_owner", "tasks", type_="foreignkey")
    op.drop_column("tasks", "owner_user_id")
