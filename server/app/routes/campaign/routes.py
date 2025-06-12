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


@campaign_bp.route('/', methods=['GET'])
def target(campaign_id):

    pass

@campaign_bp.route('/donate', methods=['POST'])
def donate(campaign_id):
    pass


@campaign_bp.route('/update', methods=['POST'])
@jwt_required()
@admin_required
def update(campaign_id):
    data = request.json

    data['id'] = campaign_id
    updated_campaign_instance = campaign_update_admin_schema.load(data)

    original_campaign = db.session.get(Campaign, campaign_id)
    if not original_campaign:
        return jsonify({"message": "Campaign not found"}), 404

    db.session.add(updated_campaign_instance)
    db.session.commit()

    response_data = campaign_admin_schema.dump(updated_campaign_instance)
    return jsonify(response_data), 200



