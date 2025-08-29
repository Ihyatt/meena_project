from app.models.user import User
from app.models.email_subscription import EmailSubscription
from app.utils.constants import SubscriptionStatus
from app.database import db


def get_or_create_donor(email_address, is_email_subscription, full_name):
    try:
        donor = User.query.filter_by(email_address=email_address).first()

        if not donor:
            donor = User(
                email_address=email_address,
                full_name=full_name,
            )
            db.session.add(donor)
            db.session.commit()

            email_subscription = EmailSubscription(
                user_id=donor.id,
                email_address=email_address,
            )
            if is_email_subscription:
                email_subscription.status = SubscriptionStatus.ACTIVE
            else:
                email_subscription.status = SubscriptionStatus.INACTIVE
            db.session.add(email_subscription)
            db.session.commit()

        return donor
    except Exception as e:
        raise ValueError(f"Error getting or creating donor: {str(e)}")
