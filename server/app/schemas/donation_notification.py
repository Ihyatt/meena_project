from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.database import db
from app.models.donation_notification import DonationNotification


class DonationNotificationSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = DonationNotification
        include_fk = True

    id = fields.Integer(dump_only=True)
    donation_id = fields.Integer(dump_only=True, data_key="donationId")
    sent_at = fields.DateTime(data_key="sentAt")
    received_at = fields.DateTime(data_key="receivedAt")

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
