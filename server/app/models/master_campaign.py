import uuid
from sqlalchemy.orm import mapped_column, relationship
from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from datetime import timezone


class MasterCampaign(db.Model, SoftDeleteMixin):

    __tablename__ = "master_campaign"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True, nullable=False)
    version_uuid = mapped_column(db.String(32), nullable=False)
    reconciled_at = mapped_column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False,
    )
    reconciled_at_version_uuid = mapped_column(db.String(32), nullable=True)

    goal = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    raised = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    total_donations = mapped_column(db.Integer, default=0, nullable=False)
    emails_queued = mapped_column(db.Integer, default=0, nullable=False)
    emails_opened = mapped_column(db.Integer, default=0, nullable=False)

    created_at = mapped_column(
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
