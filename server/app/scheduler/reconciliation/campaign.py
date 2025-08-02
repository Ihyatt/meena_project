from app.database import db

from app.models.campaign import Campaign


from flask import current_app

from app.models.task import Task
from app.models.payment_transaction import PaymentTransaction

from retrying import retry
from datetime import datetime, timezone


from datetime import datetime

from app.models.task import Task
from app.utils.constants import JobStatus, PaymentStatus
from sqlalchemy.orm.exc import StaleDataError
from sqlalchemy_continuum import version_class


# # function chould call a class


# @retry(
#     exceptions=StaleDataError,
#     wait_exponential_multiplier=1000,
#     wait_exponential_max=10000,
#     stop_max_attempt_number=3,
# )
# async def reconcile_campaign(campaign_id):
#     now = datetime.now(timezone.utc)
#     campaign = Campaign.query.get(campaign_id)

#     payment_transactions = PaymentTransaction.query.filter(
#         PaymentTransaction.reconciled_at > campaign.reconciled_at
#     ).all()
#     CampaignVersion = version_class(Campaign)
#     campaign_version = (
#         db.session.query(CampaignVersion)
#         .filter_by(version_uuid=campaign.reconciled_at_version_uuid)
#         .first()
#     )

#     reconciled_raised = campaign_version.raised

#     for payment_transaction in payment_transactions:
#         if payment_transaction.status == PaymentStatus.SUCCEEDED:
#             reconciled_raised += payment_transaction.amount
#         else:
#             reconciled_raised -= payment_transaction.amount
#     campaign.raised = reconciled_raised
#     campaign.reconciled_at = now
#     db.session.commit()


# async def campaign_reconciliation():
#     try:
#         campaigns = Campaign.query.all()

#         for campaign in campaigns:
#             new_task = Task(
#                 job_id="campaign_reconciliation",
#                 modal="campaign",
#                 campaign_id=campaign.id,
#             )
#             db.session.add(new_task)
#             try:
#                 await reconcile_campaign(campaign.id)
#                 new_task.status = JobStatus.SUCCEEDED
#                 db.session.commit()
#             except Exception as e:
#                 new_task.status = JobStatus.FAILED
#                 db.session.commit()

#     except Exception as e:
#         current_app.logger.error(str(e))
#         db.session.rollback()


def campaign_reconciliation():
    pass
