from app.models.user import User
from app.utils.constants import SubscriptionStatus
from app.database import db
from werkzeug.exceptions import NotFound


def get_or_create_donor(email_address, full_name):
    try:
        donor = User.query.filter_by(email_address=email_address).first()

        if not donor:
            donor = User(
                email_address=email_address,
                full_name=full_name,
            )

        return donor
    except Exception as e:
        raise ValueError(f"Error getting or creating donor: {str(e)}")


def update_email_subscription(donor_id, is_email_subscription):
    try:
        donor = User.query.get_or_404(donor_id)

        donor.email_subscription.email_address = donor.email_address
        if is_email_subscription:
            donor.email_subscription.status = SubscriptionStatus.ACTIVE
        else:
            donor.email_subscription.status = SubscriptionStatus.INACTIVE

    except NotFound:
        raise ValueError("Donor not found")
    except Exception as e:
        raise ValueError(f"Error getting or creating donor: {str(e)}")
