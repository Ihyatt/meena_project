import uuid
from datetime import timezone
from sqlalchemy.orm import mapped_column, relationship

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import SubscriptionStatus


class EmailSubscription(db.Model, SoftDeleteMixin):
    __tablename__ = "email_subscriptions"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)
    reconciled_at = mapped_column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False,
    )

    reconciled_at_version_uuid = mapped_column(db.String(32), nullable=True)
    email_address = mapped_column(db.String(255), nullable=False, index=True)
    blocked = mapped_column(db.Boolean, default=False, nullable=False)
    spam = mapped_column(db.Boolean, default=False, nullable=False)
    bounced = mapped_column(db.Integer, default=0, nullable=False)
    opened = mapped_column(db.Integer, default=0, nullable=False)
    queued = mapped_column(db.Integer, default=0, nullable=False)
    status = mapped_column(
        db.Enum(SubscriptionStatus), default=SubscriptionStatus.PENDING, nullable=False
    )

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

    user_id = mapped_column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="email_subscription", uselist=False)
    emails = relationship("Email", back_populates="email_subscription")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
