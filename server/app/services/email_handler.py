from app.database import db
from app.utils.constants import EmailStatus
from app.models.email import Email
from app.models.user import User
from app.models.email_template import EmailTemplate
from flask import current_app
import textwrap
from retrying import retry

from tenacity import retry
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    before_sleep_log,
    RetryError,
    wait_exponential_jitter,
    retry_if_exception_type,
)

import asyncio


def create_email(donor_id, campaign_id, email_address, email_type):

    new_email = Email(
        recipient_id=donor_id,
        recipient_email_address=email_address,
        campaign_id=campaign_id,
        email_type=email_type,
    )
    db.session.add(new_email)
    db.session.commit()
    return new_email


@retry(
    stop=stop_after_attempt(3),  # 3 attempts total
    wait=wait_exponential_jitter(
        initial=1, max=10
    ),  # Adds randomness to avoid thundering herds
    retry=retry_if_exception_type(ValueError),
)
def send_receipt_email(donor_id, campaign_id, email_address, amount, email_id):
    try:
        mailjet_client = current_app.mailjet
        email_template = EmailTemplate.query.filter_by(
            email_type=EmailType.DONATION_RECEIPT
        ).first()

        email = Email.query.get_or_404(email_id)
        donor = User.query.get_or_404(donor_id)
        data = {
            "Messages": [
                {
                    "From": {
                        "Email": "inas.raheema@gmail.com",
                        "Name": "Meena Project",
                    },
                    "To": [{"Email": donor.email_address, "Name": donor.full_name}],
                    "Subject": email_template.subject,
                    "TemplateID": email_template.template_id,
                    "TemplateLanguage": true,
                    "CustomID": str(email.id),
                    "Variables": {"name": donor.full_name, "amount": amount},
                }
            ]
        }

        try:
            result = mailjet_client.send.create(data=data)
            message_uuid = result.json()["Messages"][0]["To"][0]["MessageUUID"]
            message_id = result.json()["Messages"][0]["To"][0]["MessageID"]

            email.message_uuid = message_uuid
            email.message_id = message_id
            if result.status_code != 200:
                email.status = EmailStatus.FAILED
            else:
                email.recipient.emails_queued += 1
            db.session.commit()
            current_app.logger.info(
                f"Email '{email.id}' sent with message_uuid'{message_uuid} and message_id'{message_id}"
            )
            return {
                "status": "success",
                "message_uuid": message_uuid,
                "message_id": message_id,
                "email_id": email.id,
                "response": 200,
            }
        except Exception as e:
            current_app.logger.error(f"Failed to send email '{email.id}': {str(e)}")
            email.status = EmailStatus.FAILED
            db.session.commit()
            raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))
        raise ValueError(str(e))


@retry(
    stop=stop_after_attempt(3),  # 3 attempts total
    wait=wait_exponential_jitter(
        initial=1, max=10
    ),  # Adds randomness to avoid thundering herds
    retry=retry_if_exception_type(ValueError),
)
def send_impact_email(donor_id, campaign_id, email_id):
    try:
        email_template = EmailTemplate.query.filter_by(
            email_type=EmailType.IMPACT_UPDATE
        ).first()

        campaign = Campaign.query.get_or_404(campaign_id)
        donor = User.query.get_or_404(donor_id)
        email = Email.query.get_or_404(email_id)

        data = {
            "Messages": [
                {
                    "From": {
                        "Email": "inas.raheema@gmail.com",
                        "Name": "Meena Project",
                    },
                    "To": [{"Email": donor.email_address, "Name": donor.full_name}],
                    "Subject": email_template.subject,
                    "TemplateID": email_template.template_id,
                    "TemplateLanguage": true,
                    "CustomID": str(email.id),
                    "Variables": {"name": donor.full_name, "goal": campaign.goal},
                }
            ]
        }

        try:
            result = mailjet_client.send.create(data=data)
            message_uuid = result.json()["Messages"][0]["To"][0]["MessageUUID"]
            message_id = result.json()["Messages"][0]["To"][0]["MessageID"]

            email.message_uuid = message_uuid
            email.message_id = message_id
            if result.status_code != 200:
                email.status = EmailStatus.FAILED
            else:
                email.recipient.emails_queued += 1
            db.session.commit()
            current_app.logger.info(
                f"Email '{email.id}' sent with message_uuid'{message_uuid} and message_id'{message_id}"
            )
            return {
                "status": "success",
                "message_uuid": message_uuid,
                "message_id": message_id,
                "email_id": email.id,
                "response": 200,
            }
        except Exception as e:
            current_app.logger.error(f"Failed to send email '{email.id}': {str(e)}")
            email.status = EmailStatus.FAILED
            db.session.commit()
            raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))
        raise ValueError(str(e))


@retry(
    stop=stop_after_attempt(3),  # 3 attempts total
    wait=wait_exponential_jitter(
        initial=1, max=10
    ),  # Adds randomness to avoid thundering herds
    retry=retry_if_exception_type(ValueError),
)
def send_closeout_email(donor_id, campaign_id, email_id):
    try:
        email_template = EmailTemplate.query.filter_by(
            email_type=EmailType.CLOSEOUT
        ).first()

        campaign = Campaign.query.get_or_404(campaign_id)
        donor = User.query.get_or_404(donor_id)
        email = Email.query.get_or_404(email_id)

        data = {
            "Messages": [
                {
                    "From": {
                        "Email": "inas.raheema@gmail.com",
                        "Name": "Meena Project",
                    },
                    "To": [{"Email": donor.email_address, "Name": donor.full_name}],
                    "Subject": email_template.subject,
                    "TemplateID": email_template.template_id,
                    "TemplateLanguage": true,
                    "CustomID": str(email.id),
                    "Variables": {
                        "name": donor.full_name,
                        "goal": campaign.goal,
                        "raised": campaign.raised,
                    },
                }
            ]
        }

        try:
            result = mailjet_client.send.create(data=data)
            message_uuid = result.json()["Messages"][0]["To"][0]["MessageUUID"]
            message_id = result.json()["Messages"][0]["To"][0]["MessageID"]

            email.message_uuid = message_uuid
            email.message_id = message_id
            if result.status_code != 200:
                email.status = EmailStatus.FAILED
            else:
                email.recipient.emails_queued += 1
            db.session.commit()
            current_app.logger.info(
                f"Email '{email.id}' sent with message_uuid'{message_uuid} and message_id'{message_id}"
            )
            return {
                "status": "success",
                "message_uuid": message_uuid,
                "message_id": message_id,
                "email_id": email.id,
                "response": 200,
            }
        except Exception as e:
            current_app.logger.error(f"Failed to send email '{email.id}': {str(e)}")
            email.status = EmailStatus.FAILED
            db.session.commit()
            raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))
        raise ValueError(str(e))
