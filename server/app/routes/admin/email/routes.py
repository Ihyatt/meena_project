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
from app.utils.constants import EmailStatus
from sqlalchemy.exc import IntegrityError


@email_bp.route("/email-template", methods=["POST"])
@jwt_required()
@admin_required()
def fetch_email_template():
    try:
        data = request.get_json()

        email_template_schema = EmailTemplateSchema(
            only=["email_type", "subject", "template_id"]
        )

        validated_data = email_template_schema.load(data)

        email_type = validated_data["email_type"]
        email_template = EmailTemplate.query.filter_by(email_type=email_type).first()

        current_app.logger.info(f"Fetched email template for type '{email_type}'")
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

    except IntegrityError:
        db.session.rollback()
        current_app.logger.error(
            f"Email template for type '{email_type}' already exists.", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Email template for type '{email_type}' already exists.",
                }
            ),
            409,
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
    except Exception as e:
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


@email_bp.route("/webhook/open", methods=["POST"])
def webhoook_open():
    try:
        data = request.get_json()
        message_id = data["MessageId"]
        email = Email.query.filter_by(message_id=message_id).first()
        if email is None:
            current_app.logger.error(f"Email with message ID '{message_id}' not found.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"Email with message ID '{message_id}' not found.",
                    }
                ),
                404,
            )

        email.status = EmailStatus.OPENED
        email.recipient.emails_opened += 1
        db.session.commit()
        current_app.logger.info(f"Email '{email.id}' has been marked as opened.")
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Email '{email.id}' has been marked as opened.",
                }
            ),
            200,
        )

    except Exception as e:
        current_app.logger.error(
            f"Error marking email '{message_id}' as opened: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error marking email '{message_id}' as opened: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/bounce", methods=["POST"])
def webhook_bounce():
    try:
        data = request.get_json()
        message_id = data["MessageId"]
        email = Email.query.filter_by(message_id=message_id).first()
        if email is None:
            current_app.logger.error(f"Email with message ID '{message_id}' not found.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"Email with message ID '{message_id}' not found.",
                    }
                ),
                404,
            )

        email.status = EmailStatus.BOUNCED
        db.session.commit()

        current_app.logger.info(f"Email'{email.id}' has been marked as bounced.")
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Email '{email.id}' has been marked as bounced.",
                }
            ),
            200,
        )
    except Exception as e:
        current_app.logger.error(
            f"Error marking email '{message_id}' as bounced: {str(e)}", exc_info=True
        )
        return jsonify({"status": "failed", "message": str(e)}), 500


@email_bp.route("/webhook/spam", methods=["POST"])
def webhook_spam():
    try:
        data = request.get_json()
        message_id = data["MessageId"]
        email = Email.query.filter_by(message_id=message_id).first()
        if email is None:
            current_app.logger.error(f"Email with message ID '{message_id}' not found.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"Email with message ID '{message_id}' not found.",
                    }
                ),
                404,
            )

        email.status = EmailStatus.SPAM
        db.session.commit()
        current_app.logger.info(f"Email '{email.id}' has been marked as spam.")

        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Email '{email.id}' has been marked as spam.",
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error marking email '{message_id}' as spam: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error marking email '{message_id}' as spam: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/webhook/blocked", methods=["POST"])
def webhook_blocked():
    try:
        data = request.get_json()
        message_id = data["MessageId"]
        email = Email.query.filter_by(message_id=message_id).first()
        if email is None:
            current_app.logger.error(f"Email with message ID '{message_id}' not found.")
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"Email with message ID '{message_id}' not found.",
                    }
                ),
                404,
            )

        email.status = EmailStatus.BLOCKED
        db.session.commit()

        current_app.logger.info(f"Email has been marked as blocked: {email.id}")
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Email '{email.id}' has been marked as blocked.",
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error marking email '{message_id}' as blocked: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error marking email '{message_id}' as blocked: {str(e)}",
                }
            ),
            500,
        )


@email_bp.route("/unsubscribe", methods=["PATCH"])
def unsubsrcibe():
    return (
        jsonify(
            {
                "status": "success",
                "message": "Unsubscribe endpoint is not implemented yet.",
            }
        ),
        200,
    )
