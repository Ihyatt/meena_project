# Standard library imports
import json
import uuid
from datetime import datetime, timezone
from decimal import Decimal

# Third-party imports
from flask import current_app
from sqlalchemy.orm.exc import StaleDataError
from werkzeug.exceptions import NotFound

# Local application imports
from app.database import db
from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.donation_location import DonationLocation
from app.models.donation_notification import DonationNotification
from app.models.payment_transaction import PaymentTransaction
from app.models.user import User

from app.utils.constants import (
    DONATION_NOTIFICATIONS,
    DONATION_NOTIFICATIONS_CHANNEL,
    DonationStatus,
    EmailType,
    MAX_DONATION_NOTIFICATIONS,
    PaymentStatus,
)
from app.utils.email import create_email


def successful_charge(
    donor_id,
    email_address,
    campaign_id,
    payment_transaction_id,
    donation_id,
    idempotency_key,
    amount,
    charge_id,
    lat,
    lng,
):
    try:

        payment_transaction = PaymentTransaction.query.filter_by(
            id=payment_transaction_id, idempotency_key=idempotency_key
        ).first()
        donor = User.query.get_or_404(donor_id)
        donation = Donation.query.get_or_404(donation_id)

        payment_transaction.charge_id = charge_id

        if payment_transaction.status == PaymentStatus.SUCCEEDED:
            return

        new_donation_location = DonationLocation(lat=lat, lng=lng, amount=amount)
        if campaign_id:
            campaign = Campaign.query.get(campaign_id)
            if campaign is not None:
                campaign.raised += Decimal(amount)
                campaign.total_donations += 1
                new_donation_location.campaign_id = campaign_id

        donation.status = DonationStatus.SUCCEEDED
        payment_transaction.status = PaymentStatus.SUCCEEDED

        db.session.add(new_donation_location)

        now = datetime.now(timezone.utc)

        new_donation_notification = DonationNotification(
            donation_id=donation.id,
            sent_at=now,
        )

        db.session.add(new_donation_notification)
        db.session.flush()

        notification_metadata = {
            "full_name": (
                donor.full_name if not donation.is_anonymous else "Anonymous"
            ),
            "amount": payment_transaction.amount,
            "notification_id": new_donation_notification.id,
            "donation_id": donation.id,
            "first_time_donor": len(donor.donations) == 1,
            "donation_created_at": donation.created_at.isoformat(),
        }

        current_app.redis.zadd(
            DONATION_NOTIFICATIONS,
            {
                json.dumps(
                    notification_metadata
                ): new_donation_notification.created_at.timestamp()
            },
        )

        length = current_app.redis.zcard(DONATION_NOTIFICATIONS)

        while length > MAX_DONATION_NOTIFICATIONS:
            current_app.redis.zremrangebyrank(DONATION_NOTIFICATIONS, 0, 0)
            length = current_app.redis.zcard(DONATION_NOTIFICATIONS)

        current_app.redis.publish(
            DONATION_NOTIFICATIONS_CHANNEL, json.dumps(notification_metadata)
        )

        email = create_email(
            email_subscription_id=donor.email_subscription.id,
            recipient_email_address=email_address,
            email_type=EmailType.RECEIPT,
        )
        db.session.add(email)
        db.session.commit()

        data = {
            "donor_id": donor_id,
            "email_address": email_address,
            "amount": amount,
            "email_id": email.id,
        }

        message = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "value": EmailType.RECEIPT.value,
            "data": data,
        }
        EMAIL_PROCESS_QUEUE = "email_process_queue"
        current_app.redis.lpush("email_process_queue", json.dumps(message))

    except StaleDataError as e:
        db.session.rollback()
        raise ValueError(str(e))

    except Exception as e:
        db.session.rollback()
        raise ValueError(str(e))


def failed_charge(payment_transaction_id, idempotency_key, charge_id):

    try:
        payment_transaction = PaymentTransaction.query.filter_by(
            id=payment_transaction_id, idempotency_key=idempotency_key
        ).first()
        if not payment_transaction:
            raise ValueError(
                f"Payment transaction with id '{payment_transaction_id}' not found."
            )
        if payment_transaction.status == PaymentStatus.SUCCEEDED:

            raise ValueError(
                f"Payment transaction '{payment_transaction.charge_id}' has already been recorded."
            )
        payment_transaction.charge_id = charge_id
        payment_transaction.status = PaymentStatus.FAILED
        db.session.commit()

    except StaleDataError as e:
        db.session.rollback()
        raise ValueError(str(e))

    except Exception as e:
        db.session.rollback()
        raise ValueError(str(e))


def refunded_charge(payment_transaction_id, idempotency_key, charge_id, campaign_id):
    try:
        payment_transaction = PaymentTransaction.query.filter_by(
            id=payment_transaction_id, idempotency_key=idempotency_key
        ).first()
        if not payment_transaction:
            raise ValueError(
                f"Payment transaction with id '{payment_transaction_id}' not found."
            )
        try:
            payment_transaction.charge_id = charge_id
            if campaign_id is not None:
                campaign = Campaign.query.get_or_404(campaign_id)
                campaign.raised -= payment_transaction.amount
            payment_transaction.status = PaymentStatus.REFUNDED
            db.session.commit()

        except NotFound as e:
            raise ValueError(str(e))
        except StaleDataError as e:
            db.session.rollback()
            raise ValueError(str(e))

    except StaleDataError as e:
        db.session.rollback()
        raise ValueError(str(e))

    except Exception as e:
        db.session.rollback()
        raise ValueError(
            f"Failed to update payment transaction '{payment_transaction.id}': {str(e)}"
        )
