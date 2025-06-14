from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.donation import Donation
from app.utils.constants import CurrencyCode



class WriteOnlyDonationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Donation
        load_instance = True

    id = fields.Integer(dump_only=True)
    donor_id = fields.ForeignKey(required=True)
    campaign_id = fields.ForeignKey(required=True)
    amount = fields.Decimal(
        places=2,
        as_string=True,
        validate=validate.Range(min=0.01, max=1_000_000),
        required=True
    )
    currency = fields.Enum(CurrencyCode, required=True)


write_only_donation_schema = WriteOnlyDonationSchema()


class ReadOnlyDonationSchema(SQLAlchemyAutoSchema):
    from app.schemas.payment_transaction import ReadOnlyPaymentTransactionSchema
    from app.schemas.user import ReadOnlyDonorSchema

    class Meta:
        model = Donation
        load_instance = False

        fields = (
            "id",
            "donor_id",
            "campaign_id",
            "amount",
            "currency",
            "notes",
            "donor",
            "payment_transaction",
            "created_at",
            "updated_at"
        )

    id = fields.Integer(dump_only=True)

    donor_id = fields.ForeignKey(dump_only=Tru)
    campaign_id = fields.ForeignKey(dump_only=True)


    amount = fields.Decimal(
        places=2,
        as_string=True,
        dump_only=True
    )

    currency = fields.Enum(dump_only=Tru)

    donor = fields.Nested(ReadOnlyDonorSchema, dump_only=True)
    payment_transaction = fields.Nested(ReadOnlyPaymentTransactionSchema, dump_only=True)
    created_at = fields.AwareDateTime(format='iso', dump_only=True)
    updated_at = fields.AwareDateTime(format='iso', dump_only=True)

read_only_donation_schema = ReadOnlyDonationSchema()
