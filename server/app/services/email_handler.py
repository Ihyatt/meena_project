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


class EmailHandler:

    def __init__(self, donor_id, email_address, campaign_id, email_type):
        self.donor_id = donor_id
        self.campaign_id = campaign_id
        self.email_type = email_type
        self.amount = amount
        self.email = None
        self.mailjet_client = current_app.mailjet

    def create_email(self):
        donor = User.query.get(self.donor_id)

        self.email = Email(
            recipient_id=self.donor_id,
            recipient_email_address=donor.email_address,
            campaign_id=self.campaign_id,
            email_type=self.email_type,
        )
        db.session.add(self.email)
        db.session.commit()

    @retry(
        stop=stop_after_attempt(3),  # 3 attempts total
        wait=wait_exponential_jitter(
            initial=1, max=10
        ),  # Adds randomness to avoid thundering herds
        retry=retry_if_exception_type(ValueError),
    )
    def send_receipt_email(self):
        try:
            email_template = EmailTemplate.query.filter_by(
                email_type=self.email_type
            ).first()

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
                        "CustomID": str(self.email.id),
                        "Variables": {"name": donor.full_name, "amount": self.amount},
                    }
                ]
            }

            try:
                result = self.mailjet_client.send.create(data=data)
                message_uuid = result.json()["Messages"][0]["To"][0]["MessageUUID"]
                message_id = result.json()["Messages"][0]["To"][0]["MessageID"]

                self.email.message_uuid = message_uuid
                self.email.message_id = message_id
                if result.status_code != 200:
                    self.email.status = EmailStatus.FAILED
                else:
                    self.email.recipient.emails_queued += 1
                db.session.commit()
                current_app.logger.info(
                    f"Email '{self.email.id}' sent with message_uuid'{message_uuid} and message_id'{message_id}"
                )
                return {
                    "status": "success",
                    "message_uuid": message_uuid,
                    "message_id": message_id,
                    "email_id": self.email.id,
                    "response": 200,
                }
            except Exception as e:
                current_app.logger.error(
                    f"Failed to send email '{self.email.id}': {str(e)}"
                )
                self.email.status = EmailStatus.FAILED
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
    def send_impact_email(self, campaign_id):
        try:
            email_template = EmailTemplate.query.filter_by(
                email_type=self.email_type
            ).first()

            campaign = Campaign.query.get_or_404(campaign_id)

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
                        "CustomID": str(self.email.id),
                        "Variables": {"name": donor.full_name, "goal": campaign.goal},
                    }
                ]
            }

            try:
                result = self.mailjet_client.send.create(data=data)
                message_uuid = result.json()["Messages"][0]["To"][0]["MessageUUID"]
                message_id = result.json()["Messages"][0]["To"][0]["MessageID"]

                self.email.message_uuid = message_uuid
                self.email.message_id = message_id
                if result.status_code != 200:
                    self.email.status = EmailStatus.FAILED
                else:
                    self.email.recipient.emails_queued += 1
                db.session.commit()
                current_app.logger.info(
                    f"Email '{self.email.id}' sent with message_uuid'{message_uuid} and message_id'{message_id}"
                )
                return {
                    "status": "success",
                    "message_uuid": message_uuid,
                    "message_id": message_id,
                    "email_id": self.email.id,
                    "response": 200,
                }
            except Exception as e:
                current_app.logger.error(
                    f"Failed to send email '{self.email.id}': {str(e)}"
                )
                self.email.status = EmailStatus.FAILED
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
    def send_closeout_email(self, campaign_id):
        try:
            email_template = EmailTemplate.query.filter_by(
                email_type=self.email_type
            ).first()

            campaign = Campaign.query.get_or_404(campaign_id)

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
                        "CustomID": str(self.email.id),
                        "Variables": {
                            "name": donor.full_name,
                            "goal": campaign.goal,
                            "raised": campaign.raised,
                        },
                    }
                ]
            }

            try:
                result = self.mailjet_client.send.create(data=data)
                message_uuid = result.json()["Messages"][0]["To"][0]["MessageUUID"]
                message_id = result.json()["Messages"][0]["To"][0]["MessageID"]

                self.email.message_uuid = message_uuid
                self.email.message_id = message_id
                if result.status_code != 200:
                    self.email.status = EmailStatus.FAILED
                else:
                    self.email.recipient.emails_queued += 1
                db.session.commit()
                current_app.logger.info(
                    f"Email '{self.email.id}' sent with message_uuid'{message_uuid} and message_id'{message_id}"
                )
                return {
                    "status": "success",
                    "message_uuid": message_uuid,
                    "message_id": message_id,
                    "email_id": self.email.id,
                    "response": 200,
                }
            except Exception as e:
                current_app.logger.error(
                    f"Failed to send email '{self.email.id}': {str(e)}"
                )
                self.email.status = EmailStatus.FAILED
                db.session.commit()
                raise ValueError(f"Failed to send email: {str(e)}")
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(str(e))
            raise ValueError(str(e))
