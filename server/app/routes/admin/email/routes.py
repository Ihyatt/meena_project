from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required
from email_validator import validate_email, EmailNotValidError
from marshmallow.exceptions import ValidationError
from werkzeug.exceptions import NotFound
from app.database import db
from app.routes.admin.email import email_bp
from app.models.email import Email
from app.models.user import User
from app.models.email_template import EmailTemplate
from app.schemas.email_template import EmailTemplateSchema
from app.utils.decorators import admin_required
from app.utils.constants import EmailStatus, SubscriptionStatus
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import StaleDataError


@email_bp.route("/email-template", methods=["POST"])
@jwt_required()
@admin_required()
def fetch_email_template():
    current_app.logger.info("Fetching email template...")
    try:
        data = request.get_json()

        email_template_schema = EmailTemplateSchema(
            only=["email_type", "subject", "template_id"]
        )

        validated_data = email_template_schema.load(data)

        email_type = validated_data["email_type"]
        email_template = EmailTemplate.query.filter_by(email_type=email_type).first()

        current_app.logger.info(f"Email template for type '{email_type}' fetched.")
        return email_template_schema.dump(email_template), 200

    except ValidationError as ve:
        current_app.logger.error(
            f"Validation error while fetching or creating email template: {str(ve)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Validation error: {str(ve)}",
                }
            ),
            400,
        )

    except Exception as e:
        current_app.logger.error(
            f"Error fetching or creating email template: {str(e)}", exc_info=True
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching or creating email template: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/email-template/save", methods=["PATCH"])
@jwt_required()
@admin_required()
def save_email_template():
    try:
        data = request.get_json()

        email_template_schema = EmailTemplateSchema()
        validated_data = email_template_schema.load(data)

        email_type = validated_data["email_type"]
        email_template = EmailTemplate.query.filter_by(email_type=email_type).first()
        if email_template is None:
            current_app.logger.error(
                f"Email template for type '{email_type}' not found."
            )
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"Email template for type '{email_type}' not found.",
                    }
                ),
                404,
            )

        email_template.subject = validated_data["subject"]
        email_template.template_id = validated_data["template_id"]

        db.session.commit()

        current_app.logger.info(
            f"Subject and template ID saved for email template '{email_type}'"
        )
        return email_template_schema.dump(email_template), 200

    except ValidationError as ve:
        db.session.rollback()
        current_app.logger.error(
            f"Validation error while saving email template: {str(ve)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Validation error: {str(ve)}",
                }
            ),
            400,
        )
    except StaleDataError as sde:
        db.session.rollback()
        current_app.logger.error(
            f"Stale data error while saving email template: {str(sde)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Stale data error: {str(sde)}",
                }
            ),
            409,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error saving email template: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error saving email template: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/sent", methods=["POST"])
def webhoook_sent():
    try:
        current_app.logger.info("Received webhook for sent email.")
        data = request.json
        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                400,
            )

        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.SENT
        email.email_subscription.sent += 1
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has been sent.")
        return jsonify({"status": "success", "message": "Webhook sent received"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing webhook sent for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing webhook sent: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/open", methods=["POST"])
def webhoook_open():
    current_app.logger.info("Received webhook for opened email.")
    try:
        data = request.json

        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                200,
            )
        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.OPENED
        email.email_subscription.opened += 1
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has been opened.")
        return jsonify({"status": "success", "message": "Webhook open received"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing webhook open for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing webhook open: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/click", methods=["POST"])
def webhook_click():
    try:
        current_app.logger.info("Received webhook for clicked email.")
        data = request.json
        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                400,
            )
        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.CLICKED
        email.email_subscription.clicked += 1
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has been clicked.")
        return jsonify({"status": "success", "message": "Webhook click received"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing webhook click for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing webhook click: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/bounce", methods=["POST"])
def webhook_bounce():
    try:
        current_app.logger.info("Received webhook for bounced email.")
        data = request.json
        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                400,
            )
        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.BOUNCED
        email.email_subscription.bounced += 1
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has bounced.")
        return jsonify({"status": "success", "message": "Webhook bounce received"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing webhook bounce for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing webhook bounce: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/spam", methods=["POST"])
def webhook_spam():
    try:
        current_app.logger.info("Received webhook for spam email.")
        data = request.json
        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                400,
            )
        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.SPAM
        email.email_subscription.spam = True
        email.email_subscription.status = SubscriptionStatus.INACTIVE
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has been marked as spam.")
        return jsonify({"status": "success", "message": "Webhook spam received"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing webhook spam for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing webhook spam: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/blocked", methods=["POST"])
def webhook_blocked():
    try:
        current_app.logger.info("Received webhook for blocked email.")
        data = request.json
        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                400,
            )
        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.BLOCKED
        email.email_subscription.blocked = True
        email.email_subscription.status = SubscriptionStatus.INACTIVE
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has been blocked.")
        return (
            jsonify({"status": "success", "message": "Webhook blocked received"}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing webhook blocked for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing webhook blocked: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/unsub", methods=["POST"])
def unsubscribe():
    try:
        current_app.logger.info("Received unsubscribe request.")
        data = request.json
        CustomID = data.get("CustomID")
        if CustomID is None or CustomID == "":
            current_app.logger.error("CustomID is missing in the webhook data.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": "CustomID is missing in the webhook data.",
                    }
                ),
                400,
            )
        email = Email.query.filter_by(id=int(CustomID)).first()
        email.status = EmailStatus.UNSUB
        email.email_subscription.status = SubscriptionStatus.INACTIVE
        db.session.commit()
        current_app.logger.info(f"Email with ID {CustomID} has been unsubscribed.")

        return (
            jsonify({"status": "success", "message": "Unsubscribe request received"}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error processing unsubscribe for Email ID {CustomID}: {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error processing unsubscribe: {str(e)}",
                }
            ),
            500,
        )
