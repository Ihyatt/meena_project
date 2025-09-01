from app.database import db
from app.utils.constants import EmailStatus
from app.models.email import Email
from app.models.user import User
from app.models.campaign import Campaign
from app.models.email_template import EmailTemplate
from flask import current_app


import asyncio
from app.utils.constants import EmailType


def send_receipt_email(donor_id, email_address, amount, email_id):
    try:
        mailjet_client = current_app.mailjet
        email_template = EmailTemplate.query.filter_by(
            email_type=EmailType.RECEIPT
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
                    "To": [
                        {
                            "Email": "inas.raheema@gmail.com",  # Ensure this is a valid email string
                            "Name": donor.full_name,  # Ensure this is a string (not None)
                        }
                    ],
                    "Subject": email_template.subject,
                    "TemplateID": int(email_template.template_id),
                    "TemplateLanguage": True,
                    "CustomID": str(email.id),
                    "Variables": {"name": donor.full_name, "amount": str(amount)},
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
                email.email_subscription.queued += 1
            db.session.commit()

        except Exception as e:
            email.status = EmailStatus.FAILED
            db.session.commit()
            raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        db.session.rollback()
        raise ValueError(f"Failed to send email: {str(e)}")


def send_impact_email(donor_id, email_address, campaign_id, email_id):
    try:
        mailjet_client = current_app.mailjet
        email_template = EmailTemplate.query.filter_by(
            email_type=EmailType.IMPACT
        ).first()

        email = Email.query.get_or_404(email_id)
        donor = User.query.get_or_404(donor_id)
        campaign = Campaign.query.get_or_404(campaign_id)
        data = {
            "Messages": [
                {
                    "From": {
                        "Email": "inas.raheema@gmail.com",
                        "Name": "Meena Project",
                    },
                    "To": [
                        {
                            "Email": "inas.raheema@gmail.com",  # Ensure this is a valid email string
                            "Name": donor.full_name,  # Ensure this is a string (not None)
                        }
                    ],
                    "Subject": email_template.subject,
                    "TemplateID": int(email_template.template_id),
                    "TemplateLanguage": True,
                    "CustomID": str(email.id),
                    "Variables": {
                        "name": donor.full_name,
                        "title": campaign.title,
                        "raised": str(campaign.raised),
                        "goal": str(campaign.goal),
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
                email.email_subscription.queued += 1
            db.session.commit()

        except Exception as e:
            email.status = EmailStatus.FAILED
            db.session.commit()
            raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        db.session.rollback()
        raise ValueError(str(e))


def send_closeout_email(donor_id, email_address, campaign_id, email_id):
    try:
        mailjet_client = current_app.mailjet
        email_template = EmailTemplate.query.filter_by(
            email_type=EmailType.CLOSEOUT
        ).first()

        email = Email.query.get_or_404(email_id)
        donor = User.query.get_or_404(donor_id)
        campaign = Campaign.query.get_or_404(campaign_id)
        data = {
            "Messages": [
                {
                    "From": {
                        "Email": "inas.raheema@gmail.com",
                        "Name": "Meena Project",
                    },
                    "To": [
                        {
                            "Email": "inas.raheema@gmail.com",  # Ensure this is a valid email string
                            "Name": donor.full_name,  # Ensure this is a string (not None)
                        }
                    ],
                    "Subject": email_template.subject,
                    "TemplateID": int(email_template.template_id),
                    "TemplateLanguage": True,
                    "CustomID": str(email.id),
                    "Variables": {
                        "name": donor.full_name,
                        "title": campaign.title,
                        "raised": str(campaign.raised),
                        "goal": str(campaign.goal),
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
                email.email_subscription.queued += 1
            db.session.commit()

        except Exception as e:
            email.status = EmailStatus.FAILED
            db.session.commit()
            raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        db.session.rollback()
        raise ValueError(f"Failed to send email: {str(e)}")
