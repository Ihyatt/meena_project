from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError
from datetime import datetime, timezone, timedelta
from app.models.campaign import Campaign
from marshmallow import (
    Schema,
    pre_load,
    pre_dump,
    post_load,
    validates_schema,
    validates,
    fields,
    ValidationError,
)


"""
********************************************
    This is a read-only schema
    that will be used when donors
    navigate to landing page and 
    this schema will desirialize data
    to client
********************************************
""""
class PublicCampaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign

    id = fields.Integer(dump_only=True)
    is_active = fields.Boolean(dump_only=True)
    title = fields.String(dump_only=True)
    description = fields.String(dump_only=True)
    target_amount = fields.Decimal(dump_only=True)
    current_amount = fields.Decimal(dump_only=True)

public_campaign_schema = PublicCampaignSchema()



"""
********************************************
    This is a write-only schema
    that will be used for
    serializing/deserializing data to non-admin
********************************************
""""
class WriteOnlyCampaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        load_instance = True

    id = fields.Integer(dump_only=True)
    title = fields.String(
        required=True,
        validate=validate.Length(min=3, max=200)
    )

    description = fields.String(
        validate=validate.Length(max=5000)
    )

    target_amount = fields.Decimal(
        places=2,
        as_string=True,
        validate=validate.Range(min=0.01, max=1_000_000)
        required=True
    )

    start_date = fields.AwareDateTime(
        format='iso',
        required=True,
        validate=[
            validate.Range(
                min=datetime.now(timezone.utc),
                error="Start date cannot be in the past."
            )
        ]
    )

    end_date = fields.AwareDateTime(
        format='iso',
        required=True
    )

    is_active = fields.Boolean()

    admin_id = fields.Integer(required=True)

    @validates_schema
    def validate_dates(self, data, **kwargs):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date:
            if end_date <= start_date:
                raise ValidationError({"end_date": "End date must be after start date."})

            max_duration = 365
            if (end_date - start_date).days > max_duration:
                raise ValidationError({"end_date": f"Campaign duration cannot exceed {max_duration} days."})


# Schema Instances
write_only_campaign_schema = WriteOnlyCampaignSchema()

"""
********************************************
    This is a read-only schema
    that will be used for
    serializing/deserializing data to admin
********************************************
""""
class ReadOnlyCampaignSchema(SQLAlchemyAutoSchema):
    from app.schemas.donation import ReadOnlyDonationSchema
    from app.schemas.user import ReadOnlyAdminSchema

    class Meta:
        model = Campaign

    id = fields.Integer(dump_only=True)
    title = fields.String(dump_only=True)
    description = fields.String(dump_only=True)
    target_amount = fields.Decimal(
        places=2,
        as_string=True,
        dump_only=True
    )
    current_amount = fields.Decimal(
        places=2,
        as_string=True,
        dump_only=True 
    )
    start_date = fields.AwareDateTime(
        format='iso',
        dump_only=True
       )
    end_date = fields.AwareDateTime(
        format='iso',
        dump_only=True
    )
    is_active = fields.Boolean(dump_only=True)
    admin_id = fields.ForeignKey(dump_only=True)

    created_at = fields.AwareDateTime(format='iso', dump_only=True)
    updated_at = fields.AwareDateTime(format='iso', dump_only=True) 

    admin = fields.Nested(ReadOnlyAdminSchema, dump_only=True)
    donations = fields.List(fields.Nested(ReadOnlyDonationSchema), dump_only=True)


# Schema Instances
read_only_campaign_schema = ReadOnlyCampaignSchema()
read_only_campaign_list_schema = ReadOnlyCampaignSchema(many=True)