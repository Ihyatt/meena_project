import os
import uuid
from datetime import datetime, timezone, timedelta
from decimal import Decimal  # For db.Numeric types
import random
from faker import Faker

from werkzeug.security import generate_password_hash

# Import your Flask app creation function from your app/__init__.py
from app import create_app
from app.utils.constants import DonationStatus


# Import your database instance and models
from app.database import db
from app.models.user import User
from app.models.campaign import Campaign
from app.models.email_template import EmailTemplate
from app.models.donation import Donation
from app.models.donation_notification import DonationNotification
from app.models.payment_transaction import PaymentTransaction
from app.models.email import Email
from app.models.image import Image

from app.models.master_campaign import MasterCampaign

# Import your constants directly from app.utils.constants
from app.utils.constants import EmailType, EmailStatus, PaymentStatus


def seed_all():
    try:
        fake = Faker()
        master_campaign = MasterCampaign()
        db.session.add(master_campaign)
        db.session.commit()

        admin = User(
            email_address="admin@example.com",
            full_name="Admin User",
            is_admin=True,
            is_master_admin=True,
            subscribed=True,
            is_anonymous=False,
        )
        admin.set_password("password")
        db.session.add(admin)
        db.session.commit()

        print("Admin user created.")
        campaigns = []
        for i in range(10):
            text = fake.text(max_nb_chars=200)
            campaign = Campaign(
                admin_id=admin.id,
                title=f"Campaign {i + 1}",
                description=text,
                is_draft=False,
                launched=True,
                goal=Decimal(random.uniform(1000.0, 10000.0)),
            )
            master_campaign.goal += campaign.goal
            campaigns.append(campaign)
            db.session.add(campaign)
        db.session.commit()

        print("Campaigns created.")

        donors = []
        for i in range(50):
            donor = User(
                email_address=f"donor{i +i}@example.com",
                full_name=fake.name(),
                subscribed=[True, False][random.randint(0, 1)],
                is_anonymous=[True, False][random.randint(0, 1)],
            )

            donors.append(donor)
            db.session.add(donor)
        db.session.commit()
        print("Donors created.")

        lat_lngs = [
            {"lat": 34.0522, "lng": -118.2437},  # Los Angeles
            {"lat": 37.7749, "lng": -122.4194},  # San Francisco
            {"lat": 32.7157, "lng": -117.1611},  # San Diego
            {"lat": 38.5816, "lng": -121.4944},  # Sacramento
            {"lat": 37.3382, "lng": -121.8863},  # San Jose
            {"lat": 34.4208, "lng": -119.6902},  # Santa Barbara
            {"lat": 36.6002, "lng": -121.8947},  # Monterey
            {"lat": 37.8715, "lng": -122.2730},  # Berkeley
            {"lat": 37.8044, "lng": -122.2712},  # Oakland
            {"lat": 33.7489, "lng": -118.1892},  # Long Beach
            {"lat": 33.9110, "lng": -117.8465},  # Anaheim
            {"lat": 33.6891, "lng": -117.8427},  # Irvine
            {"lat": 34.2376, "lng": -118.5303},  # Northridge (Los Angeles)
            {"lat": 34.1478, "lng": -118.1445},  # Pasadena
            {"lat": 34.0207, "lng": -118.6919},  # Malibu
            {"lat": 33.7042, "lng": -117.7943},  # Santa Ana
            {"lat": 33.7915, "lng": -117.8969},  # Orange
            {"lat": 33.7225, "lng": -117.7410},  # Lake Forest
            {"lat": 33.6148, "lng": -117.9048},  # Huntington Beach
            {"lat": 33.6405, "lng": -117.6698},  # Mission Viejo
            {"lat": 33.4284, "lng": -117.6580},  # San Clemente
            {"lat": 33.5422, "lng": -117.7661},  # Laguna Beach
            {"lat": 34.1017, "lng": -117.2917},  # San Bernardino
            {"lat": 33.9533, "lng": -117.3962},  # Riverside
            {"lat": 33.7381, "lng": -116.3636},  # Palm Springs
            {"lat": 34.1755, "lng": -116.5878},  # Big Bear Lake (Mountains)
            {"lat": 34.5667, "lng": -118.1064},  # Palmdale
            {"lat": 34.6403, "lng": -118.1569},  # Lancaster
            {"lat": 34.9904, "lng": -118.7845},  # Tehachapi
            {"lat": 35.3733, "lng": -119.0187},  # Bakersfield
            {"lat": 36.7378, "lng": -119.7871},  # Fresno
            {"lat": 36.3129, "lng": -119.3255},  # Visalia
            {"lat": 36.2048, "lng": -119.2467},  # Tulare
            {"lat": 37.0007, "lng": -119.7715},  # Clovis
            {"lat": 37.2907, "lng": -121.9908},  # Cupertino
            {"lat": 37.4219, "lng": -122.0840},  # Mountain View
            {"lat": 37.5630, "lng": -122.3255},  # San Mateo
            {"lat": 37.4419, "lng": -122.1430},  # Palo Alto
            {"lat": 37.5029, "lng": -122.2599},  # Redwood City
            {"lat": 37.6657, "lng": -122.0805},  # Fremont
            {"lat": 37.6987, "lng": -121.9287},  # Pleasanton
            {"lat": 37.9781, "lng": -121.9567},  # Concord
            {"lat": 38.0707, "lng": -122.0674},  # Antioch
            {"lat": 38.4404, "lng": -122.7141},  # Santa Rosa
            {"lat": 38.2974, "lng": -122.2868},  # Napa
            {"lat": 38.5839, "lng": -121.5708},  # West Sacramento
            {"lat": 39.7285, "lng": -121.8375},  # Chico
            {"lat": 40.5852, "lng": -122.3917},  # Redding
            {"lat": 41.2291, "lng": -124.0177},  # Eureka (Northern Coast)
            {"lat": 38.2965, "lng": -122.5684},  # Novato
            {"lat": 38.0318, "lng": -122.4274},  # Vallejo
            {"lat": 38.1041, "lng": -122.2300},  # Fairfield
            {"lat": 37.9577, "lng": -122.0315},  # Walnut Creek
            {"lat": 37.4764, "lng": -122.2274},  # Foster City
            {"lat": 37.4688, "lng": -122.1009},  # Menlo Park
            {"lat": 37.3688, "lng": -122.0363},  # Sunnyvale
            {"lat": 37.3541, "lng": -121.9552},  # Santa Clara
            {"lat": 37.2307, "lng": -121.9686},  # Los Gatos
            {"lat": 37.1670, "lng": -121.5878},  # Morgan Hill
            {"lat": 37.0024, "lng": -121.5658},  # Gilroy
            {"lat": 36.9741, "lng": -122.0308},  # Santa Cruz
            {"lat": 36.8893, "lng": -121.7827},  # Watsonville
            {"lat": 36.6777, "lng": -121.6555},  # Salinas
            {"lat": 36.2163, "lng": -120.3698},  # Coalinga
            {"lat": 36.2530, "lng": -119.3411},  # Porterville
            {"lat": 35.4851, "lng": -120.6687},  # San Luis Obispo
            {"lat": 35.1388, "lng": -120.6480},  # Pismo Beach
            {"lat": 34.9220, "lng": -120.4357},  # Santa Maria
            {"lat": 34.6393, "lng": -120.2443},  # Lompoc
            {"lat": 34.1015, "lng": -117.8080},  # Glendora
            {"lat": 34.0950, "lng": -117.7554},  # Pomona
            {"lat": 34.0620, "lng": -117.5910},  # Fontana
            {"lat": 34.0224, "lng": -117.1824},  # Redlands
            {"lat": 33.8869, "lng": -117.9254},  # Fullerton
            {"lat": 33.8003, "lng": -117.9234},  # Buena Park
            {"lat": 33.9247, "lng": -118.0125},  # Norwalk
            {"lat": 33.8683, "lng": -118.2751},  # Carson
            {"lat": 33.9714, "lng": -118.3970},  # Torrance
            {"lat": 34.0195, "lng": -118.4912},  # Santa Monica
            {"lat": 34.1500, "lng": -118.2500},  # Glendale
            {"lat": 34.1808, "lng": -118.3003},  # Burbank
            {"lat": 34.1625, "lng": -118.4417},  # Van Nuys
            {"lat": 34.0689, "lng": -118.1752},  # Alhambra
            {"lat": 34.0652, "lng": -118.0173},  # West Covina
            {"lat": 33.9311, "lng": -117.8465},  # Chino
            {"lat": 34.0042, "lng": -117.6508},  # Ontario
            {"lat": 34.1253, "lng": -117.6534},  # Rancho Cucamonga
            {"lat": 34.5029, "lng": -117.2798},  # Victorville
            {"lat": 34.8517, "lng": -117.0270},  # Barstow (Mojave Desert)
            {"lat": 34.0447, "lng": -116.1558},  # Joshua Tree (Desert)
            {"lat": 33.7225, "lng": -116.2163},  # Twentynine Palms (Desert)
            {"lat": 33.3986, "lng": -115.5510},  # El Centro (Imperial Valley)
            {"lat": 32.8906, "lng": -116.9967},  # El Cajon
            {"lat": 32.5402, "lng": -117.0345},  # Chula Vista
            {"lat": 32.6284, "lng": -117.1264},  # Coronado
            {"lat": 33.1200, "lng": -117.2923},  # Encinitas
            {"lat": 33.1959, "lng": -117.3795},  # Oceanside
            {"lat": 33.4206, "lng": -116.9600},  # Temecula
            {"lat": 33.6841, "lng": -117.2289},  # Murrieta
            {"lat": 33.5060, "lng": -117.0504},  # Wildomar
            {"lat": 33.3086, "lng": -116.9461},  # Fallbrook
            {"lat": 33.0039, "lng": -117.0864},  # Escondido
            {"lat": 32.7937, "lng": -116.7118},  # Julian (Mountains)
            {"lat": 37.6479, "lng": -119.0069},  # Mammoth Lakes (Sierra Nevada)
            {"lat": 36.5739, "lng": -118.2921},  # Lone Pine (Eastern Sierra)
            {"lat": 36.7913, "lng": -118.7565},  # Three Rivers (Sequoia NP area)
            {"lat": 41.8016, "lng": -124.0326},  # Crescent City (Far North Coast)
            {"lat": 41.1396, "lng": -121.4398},  # Mount Shasta (Northern CA)
            {"lat": 40.8038, "lng": -124.1637},  # Arcata (Northern Coast)
            {"lat": 39.4449, "lng": -123.7997},  # Fort Bragg (Mendocino Coast)
            {"lat": 38.9327, "lng": -120.0324},  # South Lake Tahoe (Sierra Nevada)
        ]

        for i in range(100):
            amount = Decimal(random.uniform(10.0, 1000.0))
            donor = random.choice(donors)
            campaign = random.choice(campaigns)
            donation = Donation(
                amount=amount,
                donor_id=donor.id,
                campaign_id=campaign.id,
                lat=lat_lngs[i]["lat"],
                lng=lat_lngs[i]["lng"],
                recurring=random.choice([True, False]),
                status=DonationStatus.SUCCEEDED,
            )
            db.session.add(donation)
            db.session.commit()

            today = datetime.now(timezone.utc)

            # Generate a random number of days between 1 and 365
            random_days = random.randint(1, 365)

            # Create a timedelta object with the random number of days
            delta = timedelta(days=random_days)

            # Subtract the timedelta from today's date
            random_date = today - delta
            donation.created_at = datetime.combine(
                random_date, datetime.min.time(), tzinfo=timezone.utc
            )

            payment_transaction = PaymentTransaction(
                amount=donation.amount,
                donor_id=donation.donor_id,
                donation_id=donation.id,
                idempotency_key=str(uuid.uuid4()),  # Unique key for idempotency
                charge_id=str(uuid.uuid4()),  # Simulating a charge ID
                status=[PaymentStatus.SUCCEEDED, PaymentStatus.FAILED][
                    random.randint(0, 1)
                ],
            )

            db.session.add(payment_transaction)
            if payment_transaction.status == PaymentStatus.SUCCEEDED:
                master_campaign.total_donations += 1
                master_campaign.raised += donation.amount
                donor.total_donated += donation.amount
                donor.total_donations += 1
                campaign.raised += donation.amount
                campaign.total_donations += 1
            db.session.commit()
            email = Email(
                recipient_id=donor.id,
                recipient_email_address=donor.email_address,
                campaign_id=campaign.id,
                email_type=EmailType.DONATION_RECEIPT,
                status=[EmailStatus.FAILED, EmailStatus.SENT, EmailStatus.OPENED][
                    random.randint(0, 2)
                ],
            )
            master_campaign.emails_queued += 1
            donor.emails_queued += 1
            db.session.add(email)
            if email.status == EmailStatus.OPENED:
                donor.emails_opened += 1
                master_campaign.emails_opened += 1

            db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Error seeding data: {e}")


if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        print("Clearing existing data...")
        db.session.query(PaymentTransaction).delete()
        db.session.query(Email).delete()
        db.session.query(Image).delete()
        db.session.query(DonationNotification).delete()
        db.session.query(Donation).delete()
        db.session.query(MasterCampaign).delete()
        db.session.query(Campaign).delete()
        db.session.query(EmailTemplate).delete()

        db.session.query(User).delete()
        db.session.commit()
        print("Existing data cleared.")

        seed_all()
