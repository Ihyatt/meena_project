import uuid

from sqlalchemy.orm import mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin


class User(db.Model, SoftDeleteMixin):
    __tablename__ = "users"
    __versioned__ = {}
    __table_args__ = (
        db.Index(
            "uq_global_admin",
            "is_master_admin",
            unique=True,
            postgresql_where=(mapped_column("is_master_admin") == True),
        ),
    )

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    email_address = mapped_column(db.String(255), nullable=True)
    password_hash = mapped_column(db.String(255), nullable=True)
    full_name = mapped_column(db.String(100), nullable=True)
    is_admin = mapped_column(db.Boolean, default=False, nullable=False)
    is_master_admin = mapped_column(db.Boolean, default=False, nullable=False)
    subscribed = mapped_column(db.Boolean, default=True, nullable=False)
    emails_queued = mapped_column(db.Integer, default=0, nullable=False)
    emails_opened = mapped_column(db.Integer, default=0, nullable=False)
    total_donated = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    total_donations = mapped_column(db.Integer, default=0, nullable=False)

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
    emails = relationship("Email", back_populates="recipient")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
