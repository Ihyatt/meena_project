# Third-party imports
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

# Local application imports
from app.models.email_template import EmailTemplate
from app.utils.constants import EmailType


class EmailTemplateSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = EmailTemplate
        include_fk = True

    id = fields.Integer(dump_only=True)
    version_uuid = fields.String(allow_none=True, dump_only=True)
    email_type = fields.Enum(EmailType, required=True, data_key="emailType")
    subject = fields.String(validate=validate.Length(max=255), allow_none=True)
    template_id = fields.String(
        validate=validate.Length(max=255), data_key="templateId", allow_none=True
    )

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
