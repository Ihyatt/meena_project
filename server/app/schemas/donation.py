from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.donation import Donation # Import your User model
from app.utils.constants import CurrencyCode
from app.schemas.private_payment import PrivatePaymentTransactionSchema
from app.schemas.user import PrivateDonorSchema



class PrivateDonationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        load_instance=False

        fields = {
            "id",
            "donor_id",
            "amount",
            "currency",
            "latitude",
            "longitude",
            "donor",
            "payment_transaction",
            "created_at"
        }


    id = fields.Integer()
    donor_id = fields.Integer()
    amount = fields.Decimal(as_string=True, places=2)
    currency = fields.Decimal(as_string=True, places=2)
    latitiude = mapped_column(db.Float, nullable=False)
    longitude = mapped_column(db.Float, nullable=False)
    donor  = fields.Nested(PrivateDonorSchema)
    payment_transaction = fields.Nested(PrivatePaymentTransactionSchema)
    created_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')


class CreateDonationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        load_instance = True # Builds the paymentTransaction object for me 
        fields = (
            "donor_id", 
            "amount", 
            "currency",
            "latitude", 
            "longitude", 
            "donor",
            "payment_transaction",
            "created_at"
        )

    donor_id = fields.Integer()
    amount = fields.Decimal(
        required=True, as_string=True, places=2, validate=validate.Range(min=0.01)
    )
    currency = fields.EnumField(CurrencyCode, required=True)
    latitude = fields.String(required=True, validate=validate.Length(min=3, max=200))
    longitude = fields.String(required=True, validate=validate.Length(min=3, max=200))
    donor = fields.Nested(PrivateDonorSchema)
    payment_transaction = fields.Nested(PrivateDonorSchema)
    created_at = fields.DateTime(required=True, format='%Y-%m-%dT%H:%M:%SZ')

