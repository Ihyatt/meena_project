from pytz import utc
from app.database import db


import os, uuid
from flask import Flask, request, jsonify
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor, ProcessPoolExecutor

from datetime import datetime
import pytz  # or use zoneinfo in Python 3.9+
from redis import Redis

from pytz import timezone
from datetime import datetime, timezone


import os
import logging
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import stripe
from mailjet_rest import Client
from datetime import timedelta

from app.scheduler.email_campaign.close import campaign_close_emails
from app.scheduler.email_campaign.reminder import campaign_reminder_emails

from app.scheduler.reconciliation.email import email_reconciliation
from app.scheduler.reconciliation.campaign import campaign_reconciliation
from app.scheduler.reconciliation.donor import donor_reconciliation
from app.scheduler.reconciliation.payment import payment_reconciliation


from app.database import db
from sqlalchemy_continuum import make_versioned
from flask_audit_logger import AuditLogger
from flask_marshmallow import Marshmallow
from apscheduler.schedulers.background import BackgroundScheduler


from app.config import Config

from app.routes.auth import auth_bp
from app.routes.admin import admin_bp
from app.routes.admin.campaign import campaign_bp
from app.routes.admin.email import email_bp
from app.routes.donation import donation_bp
from app.routes.sse import sse_bp

from app.models.email_template import EmailTemplate
from app.models.user import User
from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.email import Email
from app.models.image import Image
from app.modesl.payment_subscription import PaymentSubscription
from app.models.email_subscription import EmailSubscription
from app.models.payment_transaction import PaymentTransaction


app = Flask(__name__)
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
ma = Marshmallow()


def create_app():

    dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(dotenv_path)

    app.config.from_object(Config)

    logging.basicConfig(level=app.config.get("LOG_LEVEL", logging.INFO))

    app.logger.setLevel(app.config.get("LOG_LEVEL", logging.INFO))

    # Create a FileHandler to write logs to a file
    file_handler = logging.FileHandler("app.log")

    # Optionally, set a formatter for the log messages
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    file_handler.setFormatter(formatter)

    # Add the FileHandler to the app's logger
    app.logger.addHandler(file_handler)

    app.redis = Redis(host="127.0.0.1", port=6379, decode_responses=True, db=0)

    cors.init_app(app)
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    app.mailjet = Client(
        auth=(app.config["MAIL_JET_API_KEY"], app.config["MAIL_JET_SECRET_KEY"]),
        version="v3.1",
    )

    app.s3 = boto3.client("s3")
    stripe.api_key = app.config["STRIPE_SECRET_KEY"]

    admin_bp.register_blueprint(email_bp)
    admin_bp.register_blueprint(campaign_bp)

    app.register_blueprint(donation_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(sse_bp)

    make_versioned(user_cls=User)

    audit_logger = AuditLogger(db)

    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

    jobstores = {
        "default": SQLAlchemyJobStore(url=app.config["SQLALCHEMY_DATABASE_URI"])
    }
    executors = {
        "default": ThreadPoolExecutor(20),
        "processpool": ProcessPoolExecutor(5),
    }

    job_defaults = {"coalesce": False, "max_instances": 3}

    scheduler = BackgroundScheduler(
        jobstores=jobstores,
        executors=executors,
        job_defaults=job_defaults,
        timezone=utc,
    )

    scheduler.start()

    scheduler.add_job(
        email_reconciliation,
        "cron",
        hour=23,
        day_of_week="sun",
        id="email_reconciliation",
        replace_existing=True,
    )

    scheduler.add_job(
        payment_reconciliation,
        "cron",
        hour=23,
        day_of_week="sun",
        id="payment_reconciliation",
        replace_existing=True,
    )

    scheduler.add_job(
        campaign_reconciliation,
        "cron",
        hour=23,
        day_of_week="sun",
        id="campaign_reconciliation",
        replace_existing=True,
    )

    scheduler.add_job(
        donor_reconciliation,
        "cron",
        hour=23,
        day_of_week="sun",
        id="donor_reconciliation",
        replace_existing=True,
    )

    scheduler.add_job(
        campaign_reminder_emails,
        "cron",
        hour=23,
        day="last thu",
        id="campaign_reminder_emails",
        replace_existing=True,
    )

    scheduler.add_job(
        campaign_close_emails,
        "cron",
        hour=23,
        id="campaign_close_emails",
        replace_existing=True,
    )

    return app
