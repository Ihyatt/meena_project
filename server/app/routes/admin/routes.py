from flask import jsonify, current_app
from flask_jwt_extended import jwt_required
from marshmallow.exceptions import ValidationError
from werkzeug.exceptions import NotFound
from app.database import db
from app.utils.constants import PaymentStatus
from app.routes.admin import admin_bp
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


@admin_bp.route("/", methods=["GET"])
@jwt_required()
@admin_required()
def dashboard():
    current_app.logger.info("Fetching dashboard data...")
    try:
        campaigns = (
            Campaign.query.filter(Campaign.is_draft == False)
            .order_by(Campaign.updated_at.desc())
            .all()
        )

        donations = (
            Donation.query.filter(Donation.status == DonationStatus.SUCCEEDED)
            .order_by(Donation.created_at.desc())
            .all()
        )

        lat_lng_donations = [
            {
                "lat": donation.lat,
                "lng": donation.lng,
            }
            for donation in donations
            if donation.lat is not None and donation.lng is not None
        ]

        onetime_donations = []
        now = datetime.now(timezone.utc)

        for donation in donations:
            time_diff = now - donation.created_at
            if time_diff.days < 182:  # 6 months
                onetime_donations.append(
                    {"created_at": donation.created_at, "amount": donation.amount}
                )

        donations_window = {
            "onetime": onetime_donations,
        }

        donors = (
            User.query.filter(User.is_admin == False)
            .order_by(User.email_address.asc())
            .all()
        )

        current_app.logger.debug(f"donations: {donations}")
        current_app.logger.debug("*******************")
        current_app.logger.info("Dashboard data fetched.")
        return (
            jsonify(
                {
                    "donationsLocation": lat_lng_donations,
                    "launchedCampaigns": len(campaigns),
                    "donationsCount": len(donations),
                    "raised": sum(donation.amount for donation in donations),
                    "donorsCount": len(donors),
                    "donationsWindow": donations_window,
                    "donations": donations_window,
                }
            ),
            200,
        )

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
