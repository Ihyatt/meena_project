from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import PaymentStatus




class WriteOnlyPaymentTransactionSchema(SQLAlchemyAutoSchema):
    from app.schemas.user import DonorSchema
    class Meta:
        model = PaymentTransaction 
        load_instance = True
        include_fk = False
        fields = (
            "id",
            "donation_id",
            "donor_id",
            "amount",
            "status",
            "idempotency_key",
        )

    id = fields.Integer(dump_only=True)

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


# Schema Instances
write_only_payment_transaction_schema = WriteOnlyPaymentTransactionSchema()




class ReadOnlyPaymentTransactionSchema(SQLAlchemyAutoSchema):
    from app.schemas.user import DonorSchema
    class Meta:
        model = PaymentTransaction 
        load_instance = False
        fields = (
            "id",
            "donation_id",
            "donor_id",
            "amount",
            "status",
            "created_at",
            "updated_at",
        )

    id = fields.Integer(dump_only=True)
    created_at = fields.AwareDateTime(format='iso', dump_only=True)
    updated_at = fields.AwareDateTime(format='iso', dump_only=True)

    donation_id = fields.Integer(dump_only=True)
    donor_id = fields.Integer(dump_only=True)

    amount = fields.Decimal(
        as_string=True,
        places=2,
        dump_only=True
    )

    status = fields.Enum(dump_only=True)

# Schema Instances
read_only_payment_transaction_schema = ReadOnlyPaymentTransactionSchema()
