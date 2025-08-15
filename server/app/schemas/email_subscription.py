from marshmallow import (
    fields,
    validate,
)
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.email_subscription import EmailSubscription
from app.utils.constants import SubscriptionStatus


class EmailSubscriptionSchema(SQLAlchemyAutoSchema):

    from app.schemas.user import AdminSchema

    class Meta:
        model = EmailSubscription
        include_fk = True

    id = fields.Integer(dump_only=True)
    email_address = fields.String(
        dump_only=True,
        data_key="emailAddress",
    )

    blocked = fields.Boolean(dump_only=True)
    spam = fields.Boolean(dump_only=True)
    bounced = fields.Integer(dump_only=True)
    opened = fields.Integer(dump_only=True)
    queued = fields.Integer(dump_only=True)
    status = fields.Enum(SubscriptionStatus, dump_only=True)

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
