from app.models.user import User


def get_or_create_donor(email_address, subscribed, is_anonymous, full_name):
    try:
        donor = User.query.filter_by(email_address=email_address).first()

        if donor:
            donor.subscribed = subscribed
            donor.is_anonymous = is_anonymous
        else:
            donor = User(
                email_address=email_address,
                is_anonymous=is_anonymous,
                full_name=full_name,
                subscribed=subscribed,
            )
        return donor
    except Exception as e:
        current_app.logger.error(f"Error getting or creating donor: {str(e)}")
        raise ValueError(f"Error getting or creating donor: {str(e)}")
