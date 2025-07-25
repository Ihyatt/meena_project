import os
import stripe
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")

    STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")
    STRIPE_ENDPOINT_SECRET = os.environ.get("STRIPE_ENDPOINT_SECRET")
    STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

    MAIL_JET_API_KEY = os.environ.get("MAIL_JET_API_KEY")
    MAIL_JET_SECRET_KEY = os.environ.get("MAIL_JET_SECRET_KEY")
    STATIC_SALT = os.getenv("STATIC_SALT")
    WEB_URL = os.getenv("WEB_URL")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    BUCKET = os.getenv("BUCKET_NAME")

    HOST = os.environ.get("HOST", "127.0.0.1")
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = os.environ.get("DEBUG", "True").lower() in ["true", "1", "yes"]

    redis_host = "127.0.0.1"
    redis_port = 6379
    redis_db = 0
    redis_queue_name = "distributed-queue"
    decode_responses = True
