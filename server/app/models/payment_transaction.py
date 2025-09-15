# Standard library imports
import uuid

# Third-party imports
from sqlalchemy.orm import mapped_column, relationship

# Local application imports
from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from app.utils.constants import PAYMENT_STATUS, CURRENCY


class PaymentTransaction(db.Model, SoftDeleteMixin):
    __tablename__ = "payment_transactions"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)
    reconciled_at = mapped_column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False,
    )

    charge_id = mapped_column(db.String(255), nullable=True)
    amount = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    status = mapped_column(
        db.Enum(PAYMENT_STATUS), default=PAYMENT_STATUS.PENDING, nullable=False
    )
    CURRENCY = mapped_column(db.Enum(CURRENCY), default=CURRENCY.USD, nullable=True)
    idempotency_key = mapped_column(
        db.String(255), unique=True, index=True, nullable=False
    )

    payment_intent_id = mapped_column(
        db.String(255), unique=True, index=True, nullable=False
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

    donation_id = mapped_column(
        db.Integer, db.ForeignKey("donations.id"), nullable=False
    )
    donation = relationship(
        "Donation", back_populates="payment_transaction", uselist=False
    )
    donor_id = mapped_column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    donor = relationship("User", back_populates="payment_transactions")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
