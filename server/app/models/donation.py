import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import mapped_column, relationship
from app.utils.constants import CurrencyCode

from app.database import db
from app.models.mixins.models import SoftDeleteMixin
from app.utils.constants import PaymentStatus 


class Donation(db.Model, SoftDeleteMixin):
    __tablename__ = 'donations'
    __versioned__ = {}
    __table_args__ = ({"info": {"versioned": {}}},)

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    donor_id = mapped_column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    
    
    campaign_id = mapped_column(db.Integer, db.ForeignKey('campaigns.id'), nullable=False)

    amount = mapped_column(db.Numeric(10, 2),default=0.0,  nullable=False)
    currency = mapped_column(db.Enum(CurrencyCode), nullable=False)
    notes = mapped_column(db.Text, nullable=True)

    created_at = mapped_column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = mapped_column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    campaign = relationship("Campaign", back_populates="donations")
    donor = relationship("User", back_populates="donations")
    payment_transaction = relationship(
        "PaymentTransaction",
        back_populates="donation",
        uselist=False,
    )

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
