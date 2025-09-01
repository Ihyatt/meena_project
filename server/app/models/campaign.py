import uuid
from sqlalchemy.orm import mapped_column, relationship
from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin
from datetime import timezone


class Campaign(db.Model, SoftDeleteMixin):

    __tablename__ = "campaigns"
    __versioned__ = {}
    __table_args__ = (
        db.Index(
            "uq_global_active_campaign",
            "is_active",
            unique=True,
            postgresql_where=(mapped_column("is_active") == True),
        ),
        db.Index(
            "uq_global_draft_campaign",
            "is_draft",
            "admin_id",
            unique=True,
            postgresql_where=(mapped_column("is_draft") == True),
        ),
    )

    id = mapped_column(db.Integer, primary_key=True, nullable=False)
    version_uuid = mapped_column(db.String(32), nullable=False)
    reconciled_at = mapped_column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False,
    )

    reconciled_at_version_uuid = mapped_column(db.String(32), nullable=True)

    title = mapped_column(db.String(100), default="", nullable=False)
    description = mapped_column(db.String(2000), default="", nullable=False)
    image_url = mapped_column(
        db.String(500),
        default="",
        nullable=True,
    )
    goal = mapped_column(db.Integer, default=0, nullable=False)
    raised = mapped_column(db.Numeric(10, 2), default=0.0, nullable=False)
    total_donations = mapped_column(db.Integer, default=0, nullable=False)
    is_active = mapped_column(db.Boolean, default=False, nullable=False)
    is_draft = mapped_column(db.Boolean, default=True, nullable=False)
    launched = mapped_column(db.DateTime(timezone=True), nullable=True)
    closeoutDate = mapped_column(db.DateTime(timezone=True), nullable=True)

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

    admin_id = mapped_column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    admin = relationship(
        "User", back_populates="admin_campaigns", foreign_keys=[admin_id]
    )
    images = relationship("Image", back_populates="campaign")
    donations = relationship("Donation", back_populates="campaign")
    donation_locations = relationship("DonationLocation", back_populates="campaign")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
