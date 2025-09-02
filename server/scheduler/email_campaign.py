# Standard library imports
import json
import uuid
from datetime import datetime, timezone

# Third-party imports
from flask import current_app

# Local application imports
from app.database import db
from app.models.campaign import Campaign
from app.models.email_subscription import EmailSubscription
from app.utils.constants import EmailType, SubscriptionStatus
from app.utils.email import create_email


def impact_email():
    with current_app.app_context():  # Create application context
        EMAIL_PROCESS_QUEUE = "email_process_queue"

        active_campaigns = Campaign.query.filter_by(is_active=True).first()
        if not active_campaigns:
            return

        email_subscriptions = EmailSubscription.query.filter_by(
            status=SubscriptionStatus.ACTIVE
        ).all()

        for subscription in email_subscriptions:
            donor = subscription.user
            email = create_email(
                subscription.id, subscription.email_address, EmailType.IMPACT
            )
            db.session.add(email)
            db.session.commit()

            data = {
                "donor_id": donor.id,
                "email_address": subscription.email_address,
                "campaign_id": active_campaigns.id,
                "email_id": email.id,
            }

            message = {
                "id": str(uuid.uuid4()),
                "timestamp": datetime.now().isoformat(),
                "value": EmailType.IMPACT.value,
                "data": data,
            }

            current_app.redis.lpush(EMAIL_PROCESS_QUEUE, json.dumps(message))


def closeout_email():

    EMAIL_PROCESS_QUEUE = "email_process_queue"
    active_campaigns = Campaign.query.filter_by(is_active=True).first()
    if not active_campaigns:
        return

    now = datetime.now(timezone.utc).date()
    if active_campaigns.closeout_date != None:
        closeout_date = active_campaigns.closeout_date.date()
        if (closeout_date - now).days == 10:
            email_subscriptions = EmailSubscription.query.filter_by(
                status=SubscriptionStatus.ACTIVE
            ).all()

            for subscription in email_subscriptions:
                donor = subscription.user
                email = create_email(
                    subscription.id, subscription.email_address, EmailType.CLOSEOUT
                )
                db.session.add(email)
                db.session.commit()

                data = {
                    "donor_id": donor.id,
                    "email_address": subscription.email_address,
                    "campaign_id": active_campaigns.id,
                    "email_id": email.id,
                }

                message = {
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now().isoformat(),
                    "value": EmailType.CLOSEOUT.value,
                    "data": data,
                }

                current_app.redis.lpush(EMAIL_PROCESS_QUEUE, json.dumps(message))
