from app.models.donation import Donation

from flask import current_app
from app.database import db


def create_donation(donor_id, amount, lat, lng, is_anonymous):
    try:
        donation = Donation(
            donor_id=donor_id,
            amount=amount,
            lat=lat,
            lng=lng,
            is_anonymous=is_anonymous,
        )
        db.session.add(donation)
        db.session.commit()
        return donation
    except Exception as e:
        current_app.logger.error(f"Error creating donation: {str(e)}")
        raise ValueError(f"Error creating donation: {str(e)}")
