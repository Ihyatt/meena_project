# Third-party imports
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

# Local application imports
from app.models.campaign import Campaign


class CampaignSchema(SQLAlchemyAutoSchema):

    from app.schemas.user import AdminSchema

    class Meta:
        model = Campaign
        include_fk = True

    id = fields.Integer(dump_only=True)
    title = fields.String(
        allow_none=True,
    )
    description = fields.String(
        allow_none=True,
    )
    image_url = fields.String(allow_none=True, data_key="imageUrl")
    goal = fields.Integer(
        allow_none=True,
        strict=True,  # Ensures only integers are accepted
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
    closeout_date = fields.DateTime(data_key="closeoutDate", allow_none=True)

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
