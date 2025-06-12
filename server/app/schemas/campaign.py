from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError

from app.models.campaign import campaign

from app.schemas.donation import PrivateDonationSchema
from app.schemas.user import PrivateDonorSchema, PrivateAdminSchema



class CreateCampaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        load_instance = True # Builds the campaign object for me 
        fields = (
            "title", 
            "description", 
            "target_amount",
            "start_date", 
            "end_date", 
            "admin_id"
        )
        
    title = fields.String(required=True, validate=validate.Length(min=3, max=200))
    description = fields.String(required=True, validate=validate.Length(min=10))
    target_amount = fields.Decimal(
        required=True, as_string=True, places=2, validate=validate.Range(min=0.01)
    )
    start_date = fields.DateTime(required=True, format='%Y-%m-%dT%H:%M:%SZ')
    end_date = fields.DateTime(required=True, format='%Y-%m-%dT%H:%M:%SZ')
    admin_id = fields.Integer(required=True)


    @validates_schema
    def validate_dates(self, data, **kwargs):
        if data["end_date"] <= data["start_date"]:
            raise ValidationError("end_date must be after start_date.")


create_campaign_schema = CreateCampaignSchema()


class EditCampaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        load_instance = False # Do not create a new object
        partial = True
        fields = (
            "title", 
            "description", 
            "target_amount",
            "start_date", 
            "end_date", 
            "admin_id"
            "ia_active"
        )
        

    title = fields.String(validate=validate.Length(min=3, max=200))
    description = fields.String(validate=validate.Length(min=10))
    is_active = fields.Boolean(required=True)
    target_amount = fields.Decimal(as_string=True, places=2, validate=validate.Range(min=0.01))
    start_date = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    end_date = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    admin_id = fields.Integer()

    @validates_schema
    def validate_dates(self, data, **kwargs):
        if "start_date" in data and "end_date" in data:
            if data["end_date"] <= data["start_date"]:
                raise ValidationError({"_schema": "end_date must be after start_date."})

edit_campaign_schema = EditCampaignSchema()



class PublicCampaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        load_instance = False 
        fields = (
            "title", 
            "description", 
            "target_amount",
            "current_amount",
        )
        
    target_amount = fields.Decimal(required=True,  places=2, as_string=True, dump_only=True)
    current_amount = fields.Decimal(required=True, as_string=True, places=2,  dump_only=True)
    title = fields.String(required=True,  dump_only=True)
    is_active = fields.Boolean(required=True, dump_only=True) #dump_only= true because i dont want the client to make changes to this data
    description = fields.String(required=True)

public_campaign_schema = PublicCampaignSchema()


class PrivateCapaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        load_instance = False 
        include_fk = True     # Includes user_id foreign key

        fields = (
            "id", 
            "title", 
            "description",
            "target_amount", 
            "current_amount",
            "start_date", 
            "end_date", 
            "is_active",
            "admin_id",
            "created_at", 
            "updated_at",
            "admin", #relationship
            "donations"#relationship
        )
    
    target_amount = fields.Decimal(as_string=True, places=2)
    current_amount = fields.Decimal(as_string=True, places=2)
    start_date = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    end_date = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    created_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    updated_at = fields.DateTime(format='%Y-%m-%dT%H:%M:%SZ')
    admin = fields.Nested(PrivateAdminSchema) # admin details
    donations = fields.List(fields.Nested(PrivateDonationSchema)) # List of detailed donations

private_campaign_schema = PrivateCampaignSchema() #for one campaign
private_campaign_schema = PrivateCampaignSchema(many=True) #for all campaigns