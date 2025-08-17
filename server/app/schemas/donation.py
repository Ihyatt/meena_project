from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from decimal import Decimal
from app.models.donation import Donation
from app.utils.constants import DonationStatus


class DonationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        include_fk = True

    id = fields.Integer(dump_only=True)

    donor_id = fields.Integer(allow_none=True, data_key="donorId")
    campaign_id = fields.Integer(allow_none=True, data_key="campaignId")

    status = fields.Enum(
        DonationStatus,
        allow_none=True,
    )
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
    is_anonymous = fields.Boolean(required=True, data_key="isAnonymous")

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
    payment_transaction = fields.List(
        fields.Nested("PaymentTransactionSchema", only=("id", "status")),
        data_key="paymentTransaction",
    )
