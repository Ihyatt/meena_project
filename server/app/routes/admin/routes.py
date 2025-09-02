# Standard library imports
from collections import defaultdict
from datetime import datetime, timezone

# Third-party imports
from flask import current_app, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func

# Local application imports
from app.database import db
from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.donation_location import DonationLocation
from app.routes.admin import admin_bp
from app.schemas.campaign import CampaignSchema
from app.schemas.donation_location import DonationLocationSchema
from app.utils.constants import DonationStatus
from app.utils.decorators import admin_required


@admin_bp.route("/", methods=["GET"])
@jwt_required()
@admin_required()
def dashboard():
    current_app.logger.info("Fetching dashboard data...")
    try:
        now = datetime.now(timezone.utc)

        campaigns = (
            Campaign.query.filter(Campaign.is_draft == False)
            .order_by(Campaign.updated_at.desc())
            .all()
        )
        campaign = Campaign.query.filter_by(is_active=True).first()

        track_active_cammpaign_donations = defaultdict(lambda: {"raised": 0})

        if campaign:
            for donation in campaign.donations:
                curr_year = now.year
                if (
                    donation.created_at.year == curr_year
                    and donation.status == DonationStatus.SUCCEEDED
                ):
                    week_number_of_year = donation.created_at.strftime("%V")

                    track_active_cammpaign_donations[week_number_of_year][
                        "raised"
                    ] += donation.amount

        donations = (
            Donation.query.filter(Donation.status == DonationStatus.SUCCEEDED)
            .order_by(Donation.created_at.asc())
            .all()
        )

        donation_location = DonationLocation.query.all()
        donation_location_schema = DonationLocationSchema(many=True)

        all_time_donation_retention_data = {
            "new": {"amount": 0},
            "repeat": {"amount": 0},
        }  # all historic donations for pie chart data

        curr_year_individual_donation_retention_data = {
            "new": [],
            "repeat": [],
        }  # bubble chart data

        curr_year_by_month_donation_retention_data = defaultdict(
            lambda: {"new": 0, "repeat": 0}
        )

        seen_donors = set()
        for donation in donations:
            if donation.donor.id in seen_donors:
                all_time_donation_retention_data["repeat"]["amount"] += donation.amount
            else:
                all_time_donation_retention_data["new"]["amount"] += donation.amount

            curr_year = now.year
            if donation.created_at.year == curr_year:
                curr_month = donation.created_at.month
                if donation.donor.id in seen_donors:
                    curr_year_individual_donation_retention_data["repeat"].append(
                        {"amount": donation.amount, "date": donation.created_at}
                    )
                    curr_year_by_month_donation_retention_data[curr_month][
                        "repeat"
                    ] += donation.amount

                else:
                    curr_year_individual_donation_retention_data["new"].append(
                        {"amount": donation.amount, "date": donation.created_at}
                    )
                    curr_year_by_month_donation_retention_data[curr_month][
                        "new"
                    ] += donation.amount

            seen_donors.add(donation.donor.id)

        donors = (
            db.session.query(func.count(Donation.donor_id.distinct()))
            .filter_by(status=DonationStatus.SUCCEEDED)
            .scalar()
        )

        campaign_schema = CampaignSchema(
            only=[
                "id",
                "image_url",
                "title",
                "description",
                "goal",
                "raised",
                "is_active",
                "launched",
                "closeout_date",
                "total_donations",
            ],
        )
        current_app.logger.info("Returning dashboard data response.")
        return (
            jsonify(
                {
                    "donationsLocation": donation_location_schema.dump(
                        donation_location
                    ),
                    "launchedCampaigns": len(campaigns),
                    "donationsCount": len(donations),
                    "raised": sum(donation.amount for donation in donations),
                    "donorsCount": donors,
                    "currYearIndividualDonationRetentionData": curr_year_individual_donation_retention_data,  # bubble chart
                    "allTimeDonationRetentionData": all_time_donation_retention_data,  # pie chart
                    "trackActiveCammpaignDonations": track_active_cammpaign_donations,  # line chart
                    "currYearByMonthDonationRetentionData": curr_year_by_month_donation_retention_data,  # bar chart
                    "campaign": campaign_schema.dump(campaign),
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
