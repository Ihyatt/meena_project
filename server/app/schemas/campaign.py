from marshmallow import (
    fields,
    validate,
)
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.campaign import Campaign


class CampaignSchema(SQLAlchemyAutoSchema):

    from app.schemas.user import AdminSchema

    class Meta:
        model = Campaign
        include_fk = True

    id = fields.Integer(dump_only=True)
    title = fields.String(
        required=True,
        validate=validate.Length(min=3, max=50),
    )
    description = fields.String(
        required=True,
        validate=validate.Length(min=3, max=200),
    )
    image_url = fields.String(
        allow_none=True, validate=validate.Length(max=500), data_key="imageUrl"
    )
    goal = fields.Decimal(
        places=2,
        as_string=True,
        validate=validate.Range(min=0.01, max=1_000_000),
        required=True,
    )
    raised = fields.Decimal(
        places=2,
        as_string=True,
        dump_only=True,
    )
    total_donations = fields.Integer(dump_only=True, data_key="totalDonations")
    is_active = fields.Boolean(data_key="isActive")
    is_draft = fields.Boolean(data_key="isDraft")
    launched = fields.Boolean(data_key="launched")
    closed = fields.DateTime()

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")

    admin_id = fields.Integer(dump_only=True, data_key="adminId")
    admin = fields.Nested(
        AdminSchema(only=("full_name", "id")), dump_only=True, data_key="admin"
    )
