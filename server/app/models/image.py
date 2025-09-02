# Standard library imports
import uuid

# Third-party imports
from sqlalchemy.orm import mapped_column, relationship

# Local application imports
from app.database import db
from app.models.mixins.soft_delete_mixin import SoftDeleteMixin


class Image(db.Model, SoftDeleteMixin):

    __tablename__ = "images"
    __versioned__ = {}

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)
    url = mapped_column(db.String(200), nullable=False)
    bucket = mapped_column(db.String(200), nullable=False)
    key = mapped_column(db.String(200), nullable=False)
    size = mapped_column(db.Integer, nullable=False)
    content_type = mapped_column(db.String(200), nullable=False)

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
        db.Integer, db.ForeignKey("campaigns.id"), nullable=False
    )
    campaign = relationship("Campaign", back_populates="images")

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
