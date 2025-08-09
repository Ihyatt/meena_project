import uuid
from datetime import timezone
from sqlalchemy.orm import mapped_column, relationship

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import SubscriptionStatus


class PaymentSubscription(db.Model, SoftDeleteMixin):
    __tablename__ = "payment_subscriptions"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)
    subscription_id = mapped_column(db.String(500), nullable=False)
    price_id = mapped_column(db.String(500), nullable=False)
    status = mapped_column(
        db.Enum(SubscriptionStatus), default=SubscriptionStatus.PENDING, nullable=False
    )
    is_anonymous = mapped_column(db.Boolean, default=False, nullable=False)

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

    donor_id = mapped_column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    donor = relationship("User", back_populates="payment_subscriptions")

    donations = relationship("Donation", back_populates="payment_subscription")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
