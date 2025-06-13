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
from app.schemas.donation import donation_schema
from app.schemas.payment_transaction import payment_transaction_schema
from app.schemas.user import admin_schema, donor_schema
from user_agents import parse
from app.utils.fingerprint import get_client_fingerprint



@campaign_bp.route('/donate', methods=['POST'])
def donate(campaign_id):
    data = request.get_json()
    ua = parse(request.user_agent.string)
    client_ip = request.remote_addr
    
    anonymous_user_id = get_client_fingerprint(
        client_ip,
        ua.os.family,
        ua.os.version_string, 
        ua.browser.family, 
        ua.is_mobile, 
        salt
    )
    
    donor = User.query.filter_by(email=email).first()
    anonymous_donor = User.query.filter_by(
        anonymous_user_id=anonymous_user_id
    ).first()

    if not donor or not anonymous_donor:
        donor = donor_schema(data)
        db.session.add(donor)
        db.session.commit()

    campaign = Campaign.query.get(campaign_id)
    data["campaign_id"] = campaign.id

    data["donor_id"] = donor.id
    donation = donation_schema.load(data)
    db.session.add(donation)
    db.session.commit()


    data["donation_id"] = donation.id
    data["idemportency_key"] = str(uuid.uuid4())
    payment_transaction = payment_transaction_schema.load(data)
    db.session.add(payment_transaction)
    db.session.commit()



@campaign_bp.route('/update', methods=['POST'])
@jwt_required()
@admin_required
def update(campaign_id):
    campaign = Campaign.query.get(campaign_id)

    data = request.get_json()
    updated_campaign = private_campaign_schema.load(data, instance=campaign, partial=True)

    db.session.add(updated_campaign)
    db.session.commit()

    return jsonify(private_campaign_schema.dump(updated_campaign))