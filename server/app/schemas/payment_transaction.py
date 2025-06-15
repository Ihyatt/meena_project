from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError

from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import PaymentStatus



"""
********************************************
    This is a write-only schema
    that will be used for when a donor
    submits a donotion transaction via 
    stripe api
********************************************
"""
class WriteOnlyPaymentTransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PaymentTransaction 
        load_instance = True
        include_fk = True

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

# import me :) 
write_only_payment_transaction_schema = WriteOnlyPaymentTransactionSchema()


"""
********************************************
    This is a read-only schema
    that will be used for
    Admins to view historic payment transactions
********************************************
"""
class ReadOnlyPaymentTransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PaymentTransaction
        include_fk = True 

    id = fields.Integer(dump_only=True)
    donation_id = fields.Integer(dump_only=True)
    donor_id = fields.Integer(dump_only=True)
    status = fields.Enum(PaymentStatus,dump_only=True)

# import me :) 
read_only_payment_transaction_schema = ReadOnlyPaymentTransactionSchema()
read_only_payment_list_transaction_schema = ReadOnlyPaymentTransactionSchema(many=True)
