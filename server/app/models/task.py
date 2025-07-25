import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import mapped_column
from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import JobStatus


class Task(db.Model, SoftDeleteMixin):
    __tablename__ = "tasks"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)
    job_id = mapped_column(db.String(32), nullable=False)
    model = mapped_column(db.String(255), nullable=False)
    status = mapped_column(db.Enum(JobStatus), default=JobStatus.QUEUED, nullable=False)
    charge_id = mapped_column(db.String(255), nullable=True)
    campaign_id = mapped_column(db.Integer, nullable=True)
    message_uuid = mapped_column(db.String(255), nullable=True)
    message_id = mapped_column(db.BigInteger, nullable=True)

    ended_at = mapped_column(db.DateTime(timezone=True), nullable=True)
    started_at = mapped_column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False,
    )
    updated_at = mapped_column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        onupdate=db.func.now(),
        nullable=False,
    )

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
