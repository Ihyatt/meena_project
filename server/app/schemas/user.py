from marshmallow import fields, validate, Schema, post_load
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.user import User


class LoginSchema(Schema):
    email_address = fields.Email(
        required=True, validate=validate.Length(max=255), data_key="emailAddress"
    )
    password = fields.String(required=True, validate=validate.Length(min=8, max=255))

    @post_load
    def lowerstrip_email_address(self, data, **kwargs):
        data["email_address"] = data["email_address"].lower().strip()
        return data


class AdminSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = User
        include_fk = True

    id = fields.Integer(dump_only=True)
    is_admin = fields.Boolean(required=True, data_key="isAdmin")
    full_name = fields.String(
        required=True, validate=validate.Length(max=100), data_key="fullName"
    )
    is_anonymous = fields.Boolean(required=True, data_key="isAnonymous")
    email_address = fields.Email(
        required=True, validate=validate.Length(max=255), data_key="emailAddress"
    )
    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")

    @post_load
    def lowerstrip_email_address(self, data, **kwargs):
        if data.get("email_address") is not None:
            data["email_address"] = data["email_address"].lower().strip()
        return data

    email_subscription = fields.Nested(
        "EmailSubscriptionSchema",
        only=(
            "id",
            "email_address",
            "status",
            "blocked",
            "spam",
            "bounced",
            "opened",
            "queued",
        ),
    )


class DonorSchema(SQLAlchemyAutoSchema):
    from app.schemas.email_subscription import EmailSubscriptionSchema

    class Meta:
        model = User
        include_fk = True

    id = fields.Integer(dump_only=True)
    full_name = fields.String(
        required=True, validate=validate.Length(max=100), data_key="fullName"
    )
    email_address = fields.Email(
        required=True, validate=validate.Length(max=255), data_key="emailAddress"
    )

    created_at = fields.DateTime(dump_only=True, data_key="createdAt")
    updated_at = fields.DateTime(dump_only=True, data_key="updatedAt")

    @post_load
    def lowerstrip_email_address(self, data, **kwargs):
        if data.get("email_address") is not None:
            data["email_address"] = data["email_address"].lower().strip()
        return data

    donations = fields.List(
        fields.Nested("DonationSchema", only=("id", "amount", "status", "created_at"))
    )

    email_subscription = fields.Nested(
        "EmailSubscriptionSchema",
        only=(
            "id",
            "email_address",
            "status",
            "blocked",
            "sent",
            "spam",
            "bounced",
            "opened",
            "queued",
        ),
        data_key="emailSubscription",
    )
