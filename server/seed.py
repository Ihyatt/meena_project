import os
import uuid
from datetime import datetime, timezone, timedelta
from decimal import Decimal  # For db.Numeric types
import random
from faker import Faker

from werkzeug.security import generate_password_hash

# Import your Flask app creation function from your app/__init__.py
from app import create_app


# Import your database instance and models
from app.database import db

from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.donation_notification import DonationNotification
from app.models.email import Email
from app.models.user import User
from app.models.email_subscription import EmailSubscription
from app.models.email_template import EmailTemplate
from app.models.image import Image
from app.models.payment_transaction import PaymentTransaction
from app.models.task import Task


from app.utils.constants import SubscriptionStatus, EmailType


def seed_all():
    try:

        admin = User(
            email_address="admin@example.com",
            full_name="Admin User",
            is_admin=True,
        )
        admin.set_password("password")
        db.session.add(admin)
        db.session.commit()
        print("Admin user created.")
        email_subscription = EmailSubscription(
            email_address="admin@example.com",
            status=SubscriptionStatus.ACTIVE,
            user_id=admin.id,
        )
        db.session.add(email_subscription)

        print("Email subscription created.")

        for email_type in EmailType:
            email_template = EmailTemplate(email_type=email_type)
            db.session.add(email_template)

        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Error seeding data: {e}")


if __name__ == "__main__":
    app = create_app()

    with app.app_context():

        db.session.query(User).delete()
        db.session.query(EmailSubscription).delete()
        db.session.query(EmailTemplate).delete()
        db.session.query(Campaign).delete()
        db.session.query(Donation).delete()
        db.session.query(DonationNotification).delete()
        db.session.query(Email).delete()
        db.session.query(Image).delete()
        db.session.query(PaymentTransaction).delete()
        db.session.query(Task).delete()
        db.session.commit()
        print("Existing data cleared.")

        seed_all()
