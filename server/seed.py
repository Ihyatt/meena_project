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
from app.models.user import User


def seed_all():
    try:

        admin = User(
            email_address="admin@example.com",
            full_name="Admin User",
            is_admin=True,
            is_anonymous=False,
        )
        admin.set_password("password")
        db.session.add(admin)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Error seeding data: {e}")


if __name__ == "__main__":
    app = create_app()

    with app.app_context():

        db.session.query(User).delete()
        db.session.commit()
        print("Existing data cleared.")

        seed_all()
