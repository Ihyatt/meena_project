import logging
import uuid
from flask import jsonify, request
from collections import defaultdict
from flask_jwt_extended import jwt_required
from app.routes.campaign import campaign_bp
from app.models.user import User
import asyncio

from app.models.campaign import Campaign
from app.models.donation import Donation
from app.models.payment_transaction import PaymentTransaction
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.decorators import admin_required
from app.schemas.campaign import public_campaign_schema
from user_agents import parse
from app.utils.fingerprint import get_client_fingerprint
from app.routes.donor import landing_bp






@landing_bp.route('/', methods=['GET'])
def landing_page():
    campaign = Campaign.query.filter_by(is_active=True).first()
    return jsonify(public_campaign_schema.dump(campaign))
