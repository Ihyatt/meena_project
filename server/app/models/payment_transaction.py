import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Numeric, Enum, DateTime

from app.database import db
from app.models.mixins.models import SoftDeleteMixin
from app.utils.constants import PaymentStatus



class PaymentTransaction(db.Model, SoftDeleteMixin):
    __tablename__ = 'payment_transactions'
    __versioned__ = {}
    __table_args__ = ({"info": {"versioned": {}}},)

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    donation_id = mapped_column(db.Integer, db.ForeignKey('donations.id'), unique=True, nullable=False)
    donation = relationship("Donation", back_populates="payment_transaction", uselist=False)

    donor_id = mapped_column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    amount = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    status = mapped_column(db.Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)

    idempotency_key = mapped_column(db.String(300), unique=True, nullable=False)

    created_at = mapped_column(db.DateTime(timezone=True), server_default=db.func.now(), nullable=False)
    updated_at = mapped_column(db.DateTime(timezone=True), server_default=db.func.now(), onupdate=db.func.now(), nullable=False)
    
    donor = relationship("User", back_populates="payment_transactions")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
