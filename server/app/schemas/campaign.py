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
        validate=validate.Length(min=3, max=100),
    )
    description = fields.String(
        required=True,
        validate=validate.Length(min=3, max=2000),
    )
    image_url = fields.String(
        allow_none=True, validate=validate.Length(max=500), data_key="imageUrl"
    )
    goal = fields.Integer(
        strict=True,  # Ensures only integers are accepted
        validate=validate.Range(
            min=1, max=1_000_000
        ),  # min=1 since it can't be 0 or decimal
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
    launched = fields.DateTime()
    closed = fields.DateTime()

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
