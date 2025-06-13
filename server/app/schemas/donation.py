from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError


from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.donation import Donation # Import your User model
from app.utils.constants import CurrencyCode



class DonationSchema(SQLAlchemyAutoSchema):
    from app.schemas.payment_transaction import PaymentTransactionSchema
    from app.schemas.user import DonorSchema

    class Meta:
        model = Donation
        load_instance = True
        include_fk = False

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

    donor_id = fields.Integer(required=True)
    campaign_id = fields.Integer(required=True)


    amount = fields.Decimal(
        places=2,
        as_string=True,
        validate=[
            validate.Range(min=0.01, max=1_000_000),
            validate.Regexp(r'^\d+\.\d{2}$', error="Must have exactly 2 decimal places")
        ],
        required=True
    )

    currency = fields.Enum(CurrencyCode, required=True)


    notes = fields.String(allow_none=True)

    donor = fields.Nested(DonorSchema, dump_only=True)
    payment_transaction = fields.Nested(PaymentTransactionSchema, dump_only=True)

    created_at = fields.AwareDateTime(format='iso', dump_only=True)
    updated_at = fields.AwareDateTime(format='iso', dump_only=True)

donation_schema = DonationSchema()
