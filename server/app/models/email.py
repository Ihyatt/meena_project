import uuid
from sqlalchemy.orm import mapped_column, relationship

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import EMAIL_STATUS
from app.utils.constants import EMAIL_TYPE


class Email(db.Model, SoftDeleteMixin):
    __tablename__ = "emails"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    recipient_email_address = mapped_column(db.String(255), nullable=False)
    status = mapped_column(
        db.Enum(EMAIL_STATUS), default=EMAIL_STATUS.QUEUED, nullable=False
    )
    email_type = mapped_column(db.Enum(EMAIL_TYPE), nullable=False)
    message_uuid = mapped_column(db.String(255), nullable=True)
    message_id = mapped_column(db.BigInteger, nullable=True)

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

    email_subscription_id = mapped_column(
        db.Integer, db.ForeignKey("email_subscriptions.id"), nullable=False
    )
    email_subscription = relationship("EmailSubscription", back_populates="emails")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
