import uuid

from sqlalchemy.orm import mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin


class User(db.Model, SoftDeleteMixin):
    __tablename__ = "users"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    email_address = mapped_column(db.String(255), nullable=False, index=True)
    password_hash = mapped_column(db.String(255), nullable=True)
    customer_id = mapped_column(db.String(500), nullable=True)  # stripe customer ID
    full_name = mapped_column(db.String(100), nullable=True)
    is_admin = mapped_column(db.Boolean, default=False, nullable=False)

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

    admin_campaigns = relationship(
        "Campaign", back_populates="admin", foreign_keys="[Campaign.admin_id]"
    )
    donations = relationship("Donation", back_populates="donor")
    payment_transactions = relationship("PaymentTransaction", back_populates="donor")

    email_subscription = relationship(
        "EmailSubscription",
        back_populates="user",
        uselist=False,
    )
    payment_subscriptions = relationship("PaymentSubscription", back_populates="donor")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
