import os
import stripe
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    STRIPE_SECRET_KEY = os.environ["STRIPE_SECRET_KEY"]
    STRIPE_PUBLISHABLE_KEY = os.environ["STRIPE_PUBLISHABLE_KEY"]
    stripe.api_key = STRIPE_SECRET_KEY

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')


    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    MAIL_JET_API_KEY = os.environ.get('MAIL_JET_API_KEY')
    MAIL_JET_SECRET_KEY =  os.environ.get('MAIL_JET_SECRET_KEY')
    STATIC_SALT = os.getenv("STATIC_SALT")


    HOST = os.environ.get('HOST', 'localhost')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = os.environ.get('DEBUG', 'True').lower() in ['true', '1', 'yes']