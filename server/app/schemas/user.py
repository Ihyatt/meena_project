
from marshmallow import fields
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError

from app.models.user import User



class PrivateDonorSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = False

        fields = (
            "first_name",
            "last_name",
            "email" 
        )

    first_name = fields.String(allow_none=True)
    last_name = fields.String(allow_none=True)
    email = fields.Email(allow_none=True)

private_donor_schema = PrivateDonorSchema()


class AdminLoginSchema(Schema):
    email = fields.Email( 
        required=True,
        load_only=True
    )
    password = fields.String(
        required=True,
        load_only=True #only for when data is comming in from client
    )

admin_login_schema = AdminLoginSchema()


class PrivateAdminSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User 
        fields = (
            "id"
            "email",
            "first_name",
            "last_name",
            "is_admin"
        )

    id = fields.Integer()
    email = fields.Email(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    is_admin = fields.Boolean(required=True, dump_only=True)

private_admin_schema = PrivateAdminSchema()

class CreateDonorSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

        fields = (
            "email",
            "first_name",
            "last_name", 
            "anonymous_session_hash"
        )

    first_name = fields.String(allow_none=True, validate=validate.Length(max=100))
    last_name = fields.String(allow_none=True,  validate=validate.Length(max=100))
    email = fields.Email(
        required=False,
        allow_none=True,
        validate=validate.Length(max=255)
    )
    anonymous_session_hash = fields.String(dump_only=True)


create_donor_schema = CreateDonorSchema()
