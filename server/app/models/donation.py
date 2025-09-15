# Standard library imports
import uuid

# Third-party imports
from sqlalchemy.orm import mapped_column, relationship

# Local application imports
from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import DONATION_STATUS


# this needs to be extracted so lat and long need to be on its own table
class Donation(db.Model, SoftDeleteMixin):
    __tablename__ = "donations"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    amount = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    status = mapped_column(
        db.Enum(DONATION_STATUS), default=DONATION_STATUS.PENDING, nullable=False
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

    campaign_id = mapped_column(
        db.Integer, db.ForeignKey("campaigns.id"), nullable=True
    )
    campaign = relationship("Campaign", back_populates="donations")

    donor_id = mapped_column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    donor = relationship("User", back_populates="donations")
    donation_notifications = relationship(
        "DonationNotification", back_populates="donation"
    )
    payment_transaction = relationship(
        "PaymentTransaction",
        back_populates="donation",
        uselist=False,
    )

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
