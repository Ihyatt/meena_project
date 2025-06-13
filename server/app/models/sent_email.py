import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import mapped_column, relationship

from app.database import db
from app.models.mixins.models import SoftDeleteMixin
from app.utils.constants import EmailStatus



class SentEmail(db.Model, SoftDeleteMixin):
    __tablename__ = 'sent_emails'
    __versioned__ = {}
    __table_args__ = ({"info": {"versioned": {}}},)

    id = mapped_column(db.Integer, primary_key=True)
    version_uuid = mapped_column(db.String(32), nullable=False)

    recipient_user_id = mapped_column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Or nullable=True if a sent email can exist without a user

    recipient =  relationship('User', back_populates='emails')

    recipient_email = mapped_column(db.String(255), nullable=False)
    subject = mapped_column(db.String(255), nullable=False)
    body = mapped_column(db.Text, nullable=False)

    status = mapped_column(db.Enum(EmailStatus), default=EmailStatus.QUEUED, nullable=False)
    mailjet_message_id = mapped_column(db.String(100), nullable=True, unique=True)
    bounce_details = mapped_column(db.Text, nullable=True)

    campaign_id = mapped_column(	
        db.Integer, 
        db.ForeignKey('campaigns.id'), 
        nullable=False

    )

    campaign = relationship(
        "Campaign", 
        back_populates="sent_emails"
    )


    updated_at = mapped_column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }
