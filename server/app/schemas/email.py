# Third-party imports
from marshmallow import fields, validate
from marshmallow_enum import EnumField
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

# Local application imports
from app.models.email import Email
from app.utils.constants import EmailStatus, EmailType


class EmailSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Email
        include_fk = True

    id = fields.Integer(dump_only=True)
    recipient_id = fields.Integer(required=True, data_key="recipientId")
    campaign_id = fields.Integer(required=True, data_key="campaignId")
    recipient_email_address = fields.Email(
        required=True,
        validate=validate.Length(max=255),
        data_key="recipientEmailAddress",
    )
    status = EnumField(EmailStatus, required=True, by_value=True)
    email_type = EnumField(
        EmailType, required=True, by_value=True, data_key="emailType"
    )
    message_uuid = fields.String(dump_only=True, data_key="messageUuid")
    message_id = fields.Integer(dump_only=True, data_key="messageId")

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
