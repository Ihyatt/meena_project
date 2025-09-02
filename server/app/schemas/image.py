# Third-party imports
from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

# Local application imports
from app.models.image import Image


class ImageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        include_fk = True

    id = fields.Integer(dump_only=True)
    campaign_id = fields.Integer(dump_only=True, data_key="campaignId")
    file_id = fields.String(dump_only=True, data_key="fileId")
    url = fields.String(dump_only=True)
    bucket = fields.String(dump_only=True)
    key = fields.String(dump_only=True)
    size = fields.Integer(dump_only=True)
    content_type = fields.String(dump_only=True, data_key="contentType")
