import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import mapped_column, relationship
from app.database import db
from app.models.mixins.models import SoftDeleteMixin 


class Campaign(db.Model, SoftDeleteMixin):

    __tablename__ = 'campaigns'
    __versioned__ = {} 
    __table_args__ = (
        Index('uq_global_active_campaign', 
            'is_active',
            unique=True, 
            postgresql_where=(Column('is_active') == True)),
        {"info": {"versioned": {}}}
    )
    id = mapped_column(db.Integer, primary_key=True, nullable=False)
    version_uuid = mapped_column(db.String(32), nullable=False) 

    title = mapped_column(db.String(200), unique=True,nullable=False)
    description = mapped_column(db.Text, unique=True, nullable=False)
    target_amount = mapped_column(db.Numeric(10, 2), nullable=False)
    start_date = mapped_column(db.DateTime(timezone=True), nullable=False)
    end_date = mapped_column(db.DateTime(timezone=True), nullable=False)
    is_active = mapped_column(db.Boolean, default=False, nullable=False)

    admin_id = mapped_column(db.Integer, db.ForeignKey('users.id'), nullable=False)

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

    admin = relationship(
        'User',
        back_populates='admin_campaigns',
        foreign_keys=[admin_id]
    )

   	sent_emails = relationship(
        'SentEmail', 
        back_populates='campaign'
    )



    donations = relationship('Donation', back_populates='campaign')

    __mapper_args__ = {
        "version_id_col": version_uuid,
        "version_id_generator": lambda version: uuid.uuid4().hex,
    }


    def delete(self):
        if self.end_date < datetime.now(timezone.utc):
            raise ValueError("Cannot delete past campaigns")
        super().delete()