# Third-party imports
from marshmallow import fields
from marshmallow import fields, validate

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.payment_transaction import PaymentTransaction

from app.utils.constants import PAYMENT_STATUS

# Local application imports
from app.models.image import Image


class PaymentTransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PaymentTransaction
        include_fk = True

    id = fields.Integer(dump_only=True)
    donation_id = fields.Integer(dump_only=True, data_key="donationId")
    donor_id = fields.Integer(dump_only=True, data_key="donorId")
    charge_id = fields.String(
        allow_none=True, validate=validate.Length(max=255), data_key="chargeId"
    )
    amount = fields.Decimal(
        required=True,
        as_string=True,
        places=2,
        validate=validate.Range(min=0.01, max=100_000),
    )

    status = fields.Enum(PAYMENT_STATUS)
    idempotency_key = fields.String(
        required=True, validate=validate.Length(max=255), data_key="idempotencyKey"
    )
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
