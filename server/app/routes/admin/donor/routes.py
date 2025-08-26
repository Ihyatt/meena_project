from flask import jsonify, current_app
from flask_jwt_extended import jwt_required
from marshmallow.exceptions import ValidationError
from werkzeug.exceptions import NotFound
from app.database import db
from app.utils.constants import PaymentStatus
from app.routes.admin.donor import donor_bp
from app.utils.decorators import admin_required
from app.models.user import User
from app.models.donation import Donation
from app.models.campaign import Campaign
from app.models.payment_transaction import PaymentTransaction
from app.schemas.donation import DonationSchema
from app.schemas.user import DonorSchema
from app.schemas.campaign import CampaignSchema
from app.utils.constants import DonationStatus
from datetime import datetime, timezone


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
        current_app.logger.debug(f"Fetched donors: {donors}")
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

        current_app.logger.info("Dashboard data fetched.")
        return donor_schema.dump(donors), 200

    except Exception as e:
        current_app.logger.error(
            f"Error fetching dashboard data: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching dashboard data: {str(e)}",
                }
            ),
            500,
        )


@donor_bp.route("/<int:donor_id>", methods=["GET"])
@jwt_required()
@admin_required()
def fetch_donor(donor_id):
    current_app.logger.info("Fetching donors data...")
    try:

        donor = User.query.get_or_404(donor_id)

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
        return donor_schema.dump(donor), 200

    except NotFound:
        current_app.logger.warning(f"Campaign '{donor_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Campaign with ID '{donor_id}' not found.",
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
