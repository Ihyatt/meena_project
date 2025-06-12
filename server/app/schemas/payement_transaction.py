from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import PaymentStatus


class PrivatePaymentTransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PaymentTransaction
        load_instance=False

        fields = {
            "status",
        }
    
    currency = fields.EnumField(PaymentStatus, required=True)



class CreatePaymentTransactionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        load_instance = True # Builds the paymentTransaction object for me 
        fields = (
            "donor_id", 
            "amount", 
            "currency",
            "latitude", 
            "longitude", 
        )

    donor_id = fields.Integer(required=True)
    amount = fields.Decimal(
        required=True, as_string=True, places=2, validate=validate.Range(min=0.01)
    )
    currency = fields.EnumField(CurrencyCode, required=True)
    latitude = fields.String(required=True, validate=validate.Length(min=3, max=200))
    longitude = fields.String(required=True, validate=validate.Length(min=3, max=200))

