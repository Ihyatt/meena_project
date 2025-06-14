
from marshmallow import fields
from marshmallow import fields, validate, Schema
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import ValidationError

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

from app.models.user import User



"""
Schema for when Admins login
"""
class LoginSchema(Schema):
    email = fields.Email(required=True, validate=validate.Length(max=255))
    password = fields.String(required=True, validate=validate.Length(min=8, max=255)) 
    
    @post_load
    def lowerstrip_email(self, data, **kwargs):
        data["email"] = data["email"].lower().strip()
        return data

login_schema = LoginSchema()


"""
Schema for dumping Admin data to other admins
"""
class ReadOnlyAdminSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User

    id = fields.Integer(dump_only=True)
    email = fields.Email(dump_only=True)
    first_name = fields.String(dump_only=True)
    last_name = fields.String(dump_only=True)
    is_admin = fields.Boolean(dump_only=True)
    
read_only_admin_schema = ReadOnlyAdminSchema()

"""
Schema for loading new Admins
"""
class WriteOnlyAdminSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
    
    id = fields.Integer(dump_only=True)
    email = fields.Email(
        required=True,
        validate=validate.Length(max=255)
    )
    first_name = fields.String(required=True, validate=validate.Length(max=100))
    last_name = fields.String(required=True, validate=validate.Length(max=100))
    is_admin = fields.Boolean(required=True, validate=True)

    @post_load
    def lowerstrip_email(self, data, **kwargs):
        data["email"] = data["email"].lower().strip()
        return data

write_only_admin_schema = WriteOnlyAdminSchema()


"""
Schema for loading new donors
"""
class WriteOnlyDonorSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

    id = fields.Integer(dump_only=True)
    first_name = fields.String(allow_none=True, validate=validate.Length(max=100))
    last_name = fields.String(allow_none=True, validate=validate.Length(max=100))

    email = fields.Email(
        allow_none=True,
        validate=validate.Length(max=255)
    )
    anonymous_user_id = fields.String(
        required=True,
        validate=validate.Length(max=200)
    )

    @post_load
    def lowerstrip_email(self, data, **kwargs):
        if data.get("email") is not None:
            data["email"] = data["email"].lower().strip()
        return data 

write_only_donor_schema = WriteOnlyDonorSchema()


"""
Schema for dumping donor data to admins
"""
class ReadOnlyDonorSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User

    id = fields.Integer(dump_only=True)
    first_name = fields.String(dump_only=True)
    last_name = fields.String(dump_only=True)
    anonymous_user_id = fields.String(dump_only=True)

    email = fields.Email(dump_only=True)
    anonymous_id = fields.String(dump_only=True)

read_only_donor_schema = ReadOnlyDonorSchema()