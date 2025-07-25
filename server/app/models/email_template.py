import uuid

from sqlalchemy.orm import mapped_column
from datetime import timezone

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import EmailType


class EmailTemplate(db.Model, SoftDeleteMixin):
    __tablename__ = "email_templates"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    email_type = mapped_column(
        db.Enum(EmailType), default=EmailType.NA, unique=True, nullable=False
    )
    subject = mapped_column(db.String(50), default="", nullable=False)
    body = mapped_column(db.String(1000), default="", nullable=False)

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
