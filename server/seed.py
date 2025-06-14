import uuid
from datetime import datetime, timezone, timedelta

def seed_data():
    from app import create_app
    from app.database import db
    from app.models.user import User
    from app.models.campaign import Campaign
    from app.models.donation import Donation
    from app.models.payment_transaction import PaymentTransaction
    from app.models.sent_email import SentEmail
    from app.utils.constants import CurrencyCode, PaymentStatus, EmailStatus

    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("drop db")

        print("making users")
        admin_user = User(
            email="admin@example.com",
            first_name="Admin",
            last_name="User",
            is_admin=True,
            is_active=True,
            anonymous_user_id=None
        )
        admin_user.set_password("AdminPass123!") 
        db.session.add(admin_user)

        donor_user_john = User(
            email="john.doe@example.com",
            first_name="John",
            last_name="Doe",
            is_admin=False,
            is_active=True,
            anonymous_user_id=None
        )
        donor_user_john.set_password("JohnDoePass123!")
        db.session.add(donor_user_john)

        donor_user_jane = User(
            email="jane.smith@example.com",
            first_name="Jane",
            last_name="Smith",
            is_admin=False,
            is_active=True,
            anonymous_user_id=None
        )
        donor_user_jane.set_password("JaneSmithPass123!")
        db.session.add(donor_user_jane)

        anon_user = User(
            email=None,
            password_hash=None,
            first_name="Anonymous",
            last_name="Donor",
            is_admin=False,
            is_active=True,
            anonymous_user_id=uuid.uuid4().hex 
        )
        db.session.add(anon_user)

        db.session.commit()


        active_campaign = Campaign(
            title="Urgent Disaster Relief Fund",
            description="Providing immediate aid to communities affected by recent natural disasters.",
            target_amount=100000.00,
            start_date=datetime.now(timezone.utc) - timedelta(days=7),
            end_date=datetime.now(timezone.utc) + timedelta(days=90), 
            is_active=True,
            admin_id=admin_user.id
        )
        db.session.add(active_campaign)

        future_campaign = Campaign(
            title="Youth Education Program",
            description="Support underprivileged youth with educational resources and mentorship.",
            target_amount=50000.00,
            start_date=datetime.now(timezone.utc) + timedelta(days=30),
            end_date=datetime.now(timezone.utc) + timedelta(days=180), 
            is_active=False,
            admin_id=admin_user.id
        )
        db.session.add(future_campaign)

        past_campaign = Campaign(
            title="Winter Coat Drive 2024",
            description="Helping the homeless stay warm during winter.",
            target_amount=15000.00,
            start_date=datetime(2024, 10, 1, tzinfo=timezone.utc),
            end_date=datetime(2025, 2, 28, tzinfo=timezone.utc),
            is_active=False,
            admin_id=admin_user.id
        )
        db.session.add(past_campaign)

        db.session.commit()

        donation1 = Donation(
            donor_id=donor_user_john.id,
            campaign_id=active_campaign.id,
            amount=50.00,
            currency=CurrencyCode.USD,
            notes="For the disaster relief efforts."
        )
        db.session.add(donation1)
        db.session.commit()

        transaction1 = PaymentTransaction(
            donation_id=donation1.id,
            donor_id=donor_user_john.id,
            amount=50.00,
            status=PaymentStatus.SUCCEEDED,
            idempotency_key=f"idempotent_{uuid.uuid4().hex}",
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(transaction1)

        donation2 = Donation(
            donor_id=donor_user_jane.id,
            campaign_id=active_campaign.id,
            amount=100.00,
            currency=CurrencyCode.EUR,
            notes="Glad to help!"
        )
        db.session.add(donation2)
        db.session.commit()

        transaction2 = PaymentTransaction(
            donation_id=donation2.id,
            donor_id=donor_user_jane.id,
            amount=100.00,
            status=PaymentStatus.SUCCEEDED,
            idempotency_key=f"idempotent_{uuid.uuid4().hex}",
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(transaction2)
        db.session.commit()

        donation3 = Donation(
            donor_id=anon_user.id,
            campaign_id=active_campaign.id,
            amount=25.00,
            currency=CurrencyCode.USD,
            notes="Anonymous donation."
        )
        db.session.add(donation3)
        db.session.commit()

        transaction3 = PaymentTransaction(
            donation_id=donation3.id,
            donor_id=anon_user.id,
            amount=25.00,
            status=PaymentStatus.SUCCEEDED,
            idempotency_key=f"idempotent_{uuid.uuid4().hex}",
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(transaction3)
        db.session.commit()


        active_campaign.current_amount += donation1.amount + donation2.amount + donation3.amount
        db.session.add(active_campaign)
        db.session.commit()

        email1 = SentEmail(
            recipient_user_id=donor_user_john.id,
            recipient_email=donor_user_john.email,
            subject="Thank You for Your Donation!",
            body="Dear John, thank you for your generous donation to our disaster relief fund.",
            status=EmailStatus.SENT,
            mailjet_message_id=f"mailjet_{uuid.uuid4().hex}",
            campaign_id=active_campaign.id
        )

        db.session.add(email1)
        db.session.commit()

        email2 = SentEmail(
            recipient_user_id=admin_user.id,
            recipient_email=admin_user.email,
            subject="Campaign Update: Disaster Relief Progress",
            body="Hi Admin, the 'Urgent Disaster Relief Fund' campaign is progressing well!",
            status=EmailStatus.FAILED,
            campaign_id=active_campaign.id 
        )
        db.session.add(email2)
        db.session.commit()

if __name__ == "__main__":
    seed_data()