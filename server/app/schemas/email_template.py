from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.email_template import EmailTemplate
from app.utils.constants import EmailType


class EmailTemplateSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = EmailTemplate
        include_fk = True

    id = fields.Integer(dump_only=True)
    version_uuid = fields.String(allow_none=True, dump_only=True)
    email_type = fields.Enum(EmailType, required=True, data_key="emailType")
    subject = fields.String(validate=validate.Length(max=50))
    body = fields.String(validate=validate.Length(max=1000))

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
