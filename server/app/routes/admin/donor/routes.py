from flask import jsonify, current_app
from flask import request, jsonify, current_app

from flask_jwt_extended import jwt_required
from werkzeug.exceptions import NotFound
from app.database import db
from app.routes.admin.donor import donor_bp
from app.utils.decorators import admin_required
from app.models.user import User

from app.schemas.user import DonorSchema
from app.schemas.email_subscription import EmailSubscriptionSchema
from app.utils.constants import SubscriptionStatus


from marshmallow import EXCLUDE


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


@donor_bp.route("/<int:donor_id>/manage", methods=["PATCH"])
@jwt_required()
@admin_required()
def manage_donor(donor_id):
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

        current_app.logger.debug(f"Request data: {data}")
        current_app.logger.debug(SubscriptionStatus.ACTIVE.value)
        validated_donor_data = donor_schema.load(data)

        donor.email_subscription.status = (
            SubscriptionStatus.ACTIVE
            if data["emailSubscriptionStatus"] == SubscriptionStatus.ACTIVE.value
            else SubscriptionStatus.INACTIVE
        )

        current_app.logger.info(
            f"Donor data updated2. Donor ID: {SubscriptionStatus.ACTIVE.value} { SubscriptionStatus.ACTIVE.value==data["emailSubscriptionStatus"] } {donor.email_subscription.status}"
        )

        current_app.logger.info(f"*************************")

        current_app.logger.info(
            f"Donor data updated2. Donor ID stats: {SubscriptionStatus.ACTIVE.value} { donor.email_subscription.status}"
        )

        donor.full_name = validated_donor_data["full_name"]
        donor.email_address = validated_donor_data["email_address"]
        current_app.logger.info("Donor data updated1.", {"donor_id": donor.id})

        db.session.commit()

        current_app.logger.info("Donor data updated.2", {"donor_id": donor.id})
        current_app.logger.info(f"Donor data updated1. Donor ID: {donor.id}")
        current_app.logger.info(
            f"Donor data updated2. Donor ID: {SubscriptionStatus.ACTIVE.value} { SubscriptionStatus.ACTIVE.value==data["emailSubscriptionStatus"] }"
        )
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
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching donor '{donor_id}': {str(e)}",
                }
            ),
            500,
        )
