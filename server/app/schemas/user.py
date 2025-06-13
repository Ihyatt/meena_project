
from marshmallow import fields
from marshmallow import fields, validate
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


class AdminSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_admin"
        )
    id = fields.Integer(dump_only=True)
    email = fields.Email(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    is_admin = fields.Boolean(required=True)

    @post_load
    def lowerstrip_email(self, data, **kwargs):
        data["email"] = data["email"].lower().strip()
        return data

admin_schema = AdminSchema()


class DonorSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "anonymous_user_id"
        )

    id = fields.Integer(dump_only=True)
    first_name = fields.String(allow_none=True, validate=validate.Length(max=100))
    last_name = fields.String(allow_none=True, validate=validate.Length(max=100))
    anonymous_user_id = fields.String(allow_none=True, validate=validate.Length(max=200))

    email = fields.Email(
        allow_none=True,
        validate=validate.Length(max=255)
    )
    anonymous_id = fields.String(
        validate=validate.Length(max=1000)
    )

    @post_load
    def lowerstrip_email(self, data, **kwargs):
        if data.get("email") is not None:
            data["email"] = data["email"].lower().strip()
        return data 

donor_schema = DonorSchema()