from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.donation import Donation
from app.utils.constants import CurrencyCode


"""
********************************************
    This is a write-only schema
    that will be used for
    when a donor submits a donation
********************************************
"""
class WriteOnlyDonationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        load_instance = True
        include_fk = True

    id = fields.Integer(dump_only=True)
    donor_id = fields.Integer(required=True)
    campaign_id = fields.Integer(required=True)
    amount = fields.Decimal(
        places=2,
        as_string=True,
        validate=validate.Range(min=0.01, max=1_000_000),
        required=True
    )
    currency = fields.Enum(CurrencyCode, required=True)

# import me :) 
write_only_donation_schema = WriteOnlyDonationSchema()


"""
********************************************
    This is a read-only schema
    that will be used for when Admins
    want to view historic Donation/(s)
********************************************
"""
class ReadOnlyDonationSchema(SQLAlchemyAutoSchema):
    from app.schemas.payment_transaction import ReadOnlyPaymentTransactionSchema
    from app.schemas.user import ReadOnlyDonorSchema

    class Meta:
        model = Donation
        load_instance = False
        include_fk = True

    id = fields.Integer(dump_only=True)
    donor_id = fields.Integer(dump_only=True)
    campaign_id = fields.Integer(dump_only=True)
    amount = fields.Decimal(
        places=2,
        as_string=True,
        dump_only=True
    )
    currency = fields.Enum(CurrencyCode, dump_only=True)
    donor = fields.Nested(ReadOnlyDonorSchema, dump_only=True)
    payment_transaction = fields.Nested(ReadOnlyPaymentTransactionSchema, dump_only=True)

# import me :) 
read_only_donation_schema = ReadOnlyDonationSchema()
# import me too :) 
read_only_donation_list_schema = ReadOnlyDonationSchema(many=True)
