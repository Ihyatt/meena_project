# Third-party imports
from flask import current_app

# Local application imports
from app.database import db
from app.models.donation import Donation


def create_donation(donor_id, amount, is_anonymous):
    try:
        donation = Donation(
            donor_id=donor_id,
            amount=amount,
            is_anonymous=is_anonymous,
        )

        return donation
    except Exception as e:
        raise ValueError(f"Error creating donation: {str(e)}")
