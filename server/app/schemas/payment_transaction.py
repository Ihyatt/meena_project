from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import PaymentStatus


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
        validate=validate.Range(min=0.01),
    )
    stripe_fee = fields.Decimal(
        allow_none=True,
        as_string=True,
        places=2,
        validate=validate.Range(min=0.0),
        data_key="stripeFee",
    )
    net_amount = fields.Decimal(
        allow_none=True,
        as_string=True,
        places=2,
        validate=validate.Range(min=0.0),
        data_key="netAmount",
    )
    status = fields.Enum(PaymentStatus)
    idempotency_key = fields.String(
        required=True, validate=validate.Length(max=255), data_key="idempotencyKey"
    )
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")
