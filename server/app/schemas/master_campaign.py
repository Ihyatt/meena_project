from marshmallow import (
    fields,
    validate,
)
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.master_campaign import MasterCampaign


class MasterCampaignSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = MasterCampaign

    id = fields.Integer(dump_only=True)

    goal = fields.Decimal(dump_only=True)
    raised = fields.Decimal(dump_only=True)
    total_donations = fields.Integer(dump_only=True, data_key="totalDonations")
    emails_queued = fields.Integer(dump_only=True, data_key="emailsQueued")
    emails_opened = fields.Integer(dump_only=True, data_key="emailsOpened")
