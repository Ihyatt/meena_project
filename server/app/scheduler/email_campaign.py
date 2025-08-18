from flask import current_app
from app import create_app
from app.utils.constants import SubscriptionStatus, EmailType
from app.utils.email import create_email
from app.models.email_subscription import EmailSubscription
from app.models.campaign import Campaign
from app.services.email_handler import send_impact_email, send_closeout_email


def impact_email():
    current_app.logger.info("Running impact email job...")
    with current_app.app_context():  # Create application context
        current_app.logger.info("Running impact email job...")
        EMAIL_PROCESS_QUEUE = "email_process_queue"

        active_campaigns = Campaign.query.filter_by(is_active=True).first()
        if not active_campaigns:
            current_app.logger.info("No active campaigns found for impact emails.")
            return

        email_subscriptions = EmailSubscription.query.filter_by(
            status=SubscriptionStatus.ACTIVE
        ).all()

        for subscription in email_subscriptions:
            donor = subscription.user
            email = create_email(
                subscription.id, subscription.email_address, EmailType.IMPACT
            )
            send_impact_email(
                donor.id,
                subscription.email_address,
                active_campaigns.id,
                email.id,
            )


# def closeout_email():
#     app = create_app()
#     with app.app_context():  # Create application context
#         app.logger.info("Running closeout email job...")
#         EMAIL_PROCESS_QUEUE = "email_process_queue"
#         active_campaigns = Campaign.query.filter_by(is_active=True).first()
#         if not active_campaigns:
#             app.logger.info("No active campaigns found for closeout emails.")
#             return

#         email_subscriptions = EmailSubscription.query.filter_by(
#             status=SubscriptionStatus.ACTIVE
#         ).all()

#         for subscription in email_subscriptions:
#             donor = subscription.user
#             email = create_email(
#                 subscription.id, subscription.email_address, EmailType.CLOSEOUT
#             )
#             send_closeout_email(
#                 donor.id,
#                 subscription.email_address,
#                 active_campaigns.id,
#                 email.id,
#             )
