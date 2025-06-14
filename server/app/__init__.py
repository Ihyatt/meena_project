import os
import logging
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import stripe 
from mailjet_rest import Client 

from app.database import db 
from sqlalchemy_continuum import make_versioned 
from flask_audit_logger import AuditLogger
from flask_marshmallow import Marshmallow


from app.config import Config

from app.routes.auth import auth_bp
from app.routes.admin  import admin_bp
from app.routes.campaign import campaign_bp
from app.routes.landing import landing_bp


from app.models.user import User
from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.sent_email import SentEmail
from app.models.payment_transaction import PaymentTransaction



app = Flask(__name__)
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
audit_logger = AuditLogger(db)
ma = Marshmallow(app)

def create_app():
    
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    load_dotenv(dotenv_path)

    app.config.from_object(Config)

    logging.basicConfig(level=app.config.get('LOG_LEVEL', logging.INFO))
    app.logger.setLevel(app.config.get('LOG_LEVEL', logging.INFO))
    app.logger.info("Flask application starting...")

    cors.init_app(app)
    jwt.init_app(app)
    db.init_app(app) 
    migrate.init_app(app, db)


    app.register_blueprint(campaign_bp)
    admin_bp.register_blueprint(campaign_bp)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(landing_bp)
    app.register_blueprint(admin_bp)

    make_versioned(user_cls=User)

    stripe.api_key = app.config["STRIPE_SECRET_KEY"]
    app.logger.info("Stripe client initialized.")

    app.extensions['mailjet'] = Client(
        auth=(app.config['MAIL_JET_API_KEY'], app.config['MAIL_JET_SECRET_KEY']),
        version='v3.1'
    )
    app.logger.info("Mailjet client initialized.")

    app.logger.info("Registering blueprints...")


    return app
