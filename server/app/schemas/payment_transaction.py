from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import PaymentStatus


class PaymentTransactionSchema(SQLAlchemyAutoSchema):
    from app.schemas.user import DonorSchema
    class Meta:
        model = PaymentTransaction 
        load_instance = True
        fields = (
            "id",
            "donation_id",
            "donor_id",
            "amount",
            "status",
            "idempotency_key",
            "processed_at",
            "updated_at",
            "donor",
        )

    id = fields.Integer(dump_only=True)
    processed_at = fields.AwareDateTime(format='iso', dump_only=True)
    updated_at = fields.AwareDateTime(format='iso', dump_only=True)

    donation_id = fields.Integer(required=True)
    donor_id = fields.Integer(required=True)

    amount = fields.Decimal(
        required=True,
        as_string=True,
        places=2,
        validate=validate.Range(min=0.01)
    )

    status = fields.Enum(PaymentStatus, required=True)


    idempotency_key = fields.String(
        required=True,
        validate=validate.Length(max=64)
    )

    donor = fields.Nested(DonorSchema, dump_only=True)


# Schema Instances
payment_transaction_schema = PaymentTransactionSchema()
