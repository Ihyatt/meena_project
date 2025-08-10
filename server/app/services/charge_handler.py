from sqlalchemy.orm.exc import StaleDataError
from flask import current_app, json
from app.database import db
from app.models.campaign import Campaign
from app.models.donation_notification import DonationNotification
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import (
    PaymentStatus,
    EmailType,
    DONATION_NOTIFICATIONS,
    MAX_DONATION_NOTIFICATIONS,
    DONATION_NOTIFICATIONS_CHANNEL,
)
from app.services.email_handler import EmailHandler
from werkzeug.exceptions import NotFound
from decimal import Decimal  # For db.Numeric types
import asyncio


def successful_charge(
    donor_id,
    email_address,
    campaign_id,
    payment_transaction_id,
    idempotency_key,
    amount,
    charge_id,
):
    try:
        payment_transaction = PaymentTransaction.query.filter_by(
            id=payment_transaction_id, idempotency_key=idempotency_key
        ).first()
        donor = User.query.get_or_404(donor_id)

        payment_transaction.charge_id = charge_id
        if payment_transaction.status == PaymentStatus.SUCCEEDED:
            current_app.logger.warning(
                f"Successful payment transaction '{payment_transaction.charge_id}' has already been recorded."
            )
            raise ValueError(
                f"Payment transaction '{payment_transaction.charge_id}' has already been recorded."
            )
        if campaign_id is not None and campaign_id != "":
            campaign = Campaign.query.get_or_404(campaign_id)
            campaign.raised += payment_transaction.amount
            campaign.total_donations += 1

        payment_transaction.status = PaymentStatus.SUCCEEDED

        new_donation_notification = DonationNotification(
            donation_id=payment_transaction.donation_id
        )

        db.session.add(new_donation_notification)
        db.session.commit()

        notification_metadata = {
            "full_name": (
                donor.full_name
                if not payment_transaction.donation.is_anonymous
                else "Anonymous"
            ),
            "amount": payment_transaction.amount,
            "notification_id": new_donation_notification.id,
            "donation_id": payment_transaction.donation.id,
            "donation_created_at": payment_transaction.donation.created_at.isoformat(),
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

        email_handler = EmailHandler(
            donor_id=donor.id,
            campaign_id=campaign.id,
            email_address=email_address,
            amount=payment_transaction.amount,
            email_type=EmailType.DONATION_RECEIPT,
        )
        current_app.logger.info(f"email_handler: {email_handler}")
        email = email_handler.create_email()
        current_app.logger.info(f"email: {email}")
        try:
            email_handler.send_email()
            current_app.logger.info(
                f"Donation receipt email has been sent to {email_address}."
            )
        except Exception as e:
            current_app.logger.error(
                f"Failed to send donation receipt email to {email_address}: {str(e)}"
            )
            raise ValueError(str(e))

    except StaleDataError as e:
        current_app.logger.error(str(e))
        db.session.rollback()
        raise ValueError(str(e))

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
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
            current_app.logger.warning(
                f"Failed payment transaction '{payment_transaction.charge_id}' has already been recorded."
            )
            raise ValueError(
                f"Payment transaction '{payment_transaction.charge_id}' has already been recorded."
            )
        payment_transaction.charge_id = charge_id
        payment_transaction.status = PaymentStatus.FAILED
        db.session.commit()
        current_app.logger.info(
            f"Payment transaction '{payment_transaction.id}' has been marked as failed."
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
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
            current_app.logger.info(
                f"Payment transaction '{payment_transaction.id}' has been marked as refunded."
            )
        except NotFound as e:
            current_app.logger.error(str(e))
            raise ValueError(str(e))
        except StaleDataError as e:
            current_app.logger.error(str(e))
            db.session.rollback()
            current_app.logger.error(
                f"Failed to update Campaign raised amount for campaign '{campaign_id}': {str(e)}"
            )
            raise ValueError(str(e))

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Failed to update payment transaction '{payment_transaction.id}': {str(e)}"
        )
        raise ValueError(
            f"Failed to update payment transaction '{payment_transaction.id}': {str(e)}"
        )
