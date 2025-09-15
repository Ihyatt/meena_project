# Standard library imports
# (None in this specific list)

# Third-party imports
from flask import current_app, jsonify, request
from flask_jwt_extended import jwt_required
from marshmallow import EXCLUDE
from marshmallow.exceptions import ValidationError
from sqlalchemy.orm.exc import StaleDataError
from werkzeug.exceptions import NotFound

# Local application imports
from app.database import db
from app.models.user import User
from app.routes.admin.donor import donor_bp
from app.schemas.user import DonorSchema
from app.utils.constants import SUBSCRIPTION_STATUS
from app.utils.decorators import admin_required


@donor_bp.route("/", methods=["GET"])
@jwt_required()
@admin_required()
def fetch_donors():
    current_app.logger.info("Fetching donors data...")
    try:

        donors = (
            User.query.filter(User.is_admin == False)
            .order_by(User.email_address.asc())
            .all()
        )
        donor_schema = DonorSchema(
            many=True,
            only=[
                "id",
                "email_address",
                "full_name",
                "donations",
                "email_subscription",
            ],
        )

        current_app.logger.info("Donor data fetched.")
        return donor_schema.dump(donors), 200

    except Exception as e:
        current_app.logger.error(
            f"Error fetching dashboard data: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching donor data: {str(e)}",
                }
            ),
            500,
        )


@donor_bp.route("/<int:donor_id>", methods=["GET"])
@jwt_required()
@admin_required()
def fetch_donor(donor_id):
    current_app.logger.info(f"Fetching donor data for '{donor_id}'...")
    try:

        donor = User.query.get_or_404(donor_id)

        donor_schema = DonorSchema(
            only=[
                "id",
                "email_address",
                "full_name",
                "donations",
                "email_subscription",
            ],
        )

        current_app.logger.info(f"Donor data for '{donor_id}' fetched.")
        return donor_schema.dump(donor), 200

    except NotFound:
        current_app.logger.warning(f"Donor '{donor_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Donor with ID '{donor_id}' not found.",
                }
            ),
            404,
        )

    except Exception as e:
        current_app.logger.error(
            f"Error fetching donor'{donor_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching donor '{donor_id}': {str(e)}",
                }
            ),
            500,
        )


@donor_bp.route("/<int:donor_id>/manage", methods=["PATCH"])
@jwt_required()
@admin_required()
def manage_donor(donor_id):
    current_app.logger.info(f"Managing donor data for '{donor_id}'...")
    try:
        data = request.get_json()
        donor = User.query.get_or_404(donor_id)
        data["user_id"] = donor.id

        donor_schema = DonorSchema(
            unknown=EXCLUDE,
            only=[
                "id",
                "email_address",
                "full_name",
                "donations",
                "email_subscription",
            ],
        )

        validated_donor_data = donor_schema.load(data)

        donor.email_subscription.status = (
            SUBSCRIPTION_STATUS.ACTIVE
            if data["emailSubscriptionStatus"] == SUBSCRIPTION_STATUS.ACTIVE.value
            else SUBSCRIPTION_STATUS.INACTIVE
        )

        donor.full_name = validated_donor_data["full_name"]
        donor.email_address = validated_donor_data["email_address"]

        db.session.commit()

        current_app.logger.info(f"Donor data for '{donor_id}' managed.")
        return donor_schema.dump(donor), 200

    except NotFound:
        current_app.logger.warning(f"Donor '{donor_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Donor with ID '{donor_id}' not found.",
                }
            ),
            404,
        )
    except ValueError as e:
        current_app.logger.warning(
            f"Validation error when managing donor '{donor_id}': {str(e)}"
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Validation error when managing donor '{donor_id}': {str(e)}",
                }
            ),
            400,
        )
    except StaleDataError as e:
        current_app.logger.warning(
            f"StaleDataError when managing donor '{donor_id}': {str(e)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"StaleDataError when managing donor '{donor_id}': {str(e)}",
                }
            ),
            409,
        )

    except Exception as e:
        current_app.logger.error(
            f"Error managing donor '{donor_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error managing donor '{donor_id}': {str(e)}",
                }
            ),
            500,
        )
