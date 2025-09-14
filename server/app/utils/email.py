from app.models.email import Email


def create_email(email_subscription_id, recipient_email_address, email_type):
    try:

        new_email = Email(
            email_subscription_id=email_subscription_id,
            recipient_email_address=recipient_email_address,
            email_type=email_type,
        )

        return new_email
    except Exception as e:
        raise ValueError(f"Error creating email: {str(e)}")
