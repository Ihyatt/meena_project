from app.models.donation import Donation

from flask import current_app


def create_donation(donor_id, campaign_id, amount, lat, lng):
    try:
        donation = Donation(
            donor_id=donor_id, campaign_id=campaign_id, amount=amount, lat=lat, lng=lng
        )
        return donation
    except Exception as e:
        current_app.logger.error(f"Error creating donation: {str(e)}")
        raise ValueError(f"Error creating donation: {str(e)}")
