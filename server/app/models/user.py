import uuid
from datetime import datetime, timezone
from typing import List

from sqlalchemy.orm import mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

from app.database import db
from app.models.mixins.models import SoftDeleteMixin


class User(db.Model, SoftDeleteMixin):
    __tablename__ = 'users'
    __versioned__ = {}
    __table_args__ = ({"info": {"versioned": {}}},)

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    email = mapped_column(db.String(255), nullable=True) #nullable so that we can have anon users
    password_hash = mapped_column(db.String(255), nullable=True)
    first_name = mapped_column(db.String(80), nullable=True)
    last_name = mapped_column(db.String(80), nullable=True)
    is_admin = mapped_column(db.Boolean, default=False, nullable=False)
    is_active = mapped_column(db.Boolean, default=True, nullable=False)
    anonymous_user_id = db.Column(db.String(64), unique=True, nullable=True, index=True) # SHA-256 hash output

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

    admin_campaigns = relationship(
        "Campaign",
        back_populates="admin",
        foreign_keys="[Campaign.user_id]"
    )
    

    donations = relationship(
        "Donation",
        back_populates="donor"
    )
    
    payment_transactions = relationship(
        "PaymentTransaction",
        back_populates="donor"
    )
    
    emails =  relationship('SentEmail', back_populates='recipient')


    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

 