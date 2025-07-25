from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from decimal import Decimal
from app.models.donation import Donation


class DonationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        include_fk = True

    id = fields.Integer(dump_only=True)

    donor_id = fields.Integer(required=True, data_key="donorId")
    campaign_id = fields.Integer(required=True, data_key="campaignId")
    amount = fields.Decimal(
        places=2,
        as_string=True,
        validate=validate.Range(min=0.01, max=1_000_000),
        required=True,
    )
    lat = fields.Decimal(
        places=8,
        as_string=True,
        allow_none=True,
        validate=validate.Range(min=Decimal("-90.0"), max=Decimal("90.0")),
    )
    lng = fields.Decimal(
        places=8,
        as_string=True,
        allow_none=True,
        validate=validate.Range(min=Decimal("-180.0"), max=Decimal("180.0")),
    )

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
