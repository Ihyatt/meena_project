import uuid

from sqlalchemy.orm import mapped_column, relationship
from datetime import timezone

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin


class DonationNotification(db.Model, SoftDeleteMixin):
    __tablename__ = "donation_notifications"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    donation_id = mapped_column(
        db.Integer, db.ForeignKey("donations.id"), nullable=False
    )
    sent_at = mapped_column(db.DateTime(timezone=True), nullable=True)
    received_at = mapped_column(db.DateTime(timezone=True), nullable=True)

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

    donation = relationship("Donation", back_populates="donation_notifications")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
