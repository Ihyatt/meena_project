import logging
import uuid
import stripe
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


from app.schemas.campaign import write_only_campaign_schema

from user_agents import parse
from app.utils.fingerprint import get_client_fingerprint

import logging
from flask import Blueprint, request, jsonify, current_app
import stripe


@campaign_bp.route('/update', methods=['POST'])
@jwt_required()
@admin_required(admin_id='admin_id')
def update(admin_id, campaign_id):
    campaign = Campaign.query.get(campaign_id)

    data = request.get_json()
    updated_campaign = write_only_campaign_schema.load(data, instance=campaign, partial=True)

    db.session.add(updated_campaign)
    db.session.commit()

    return jsonify(write_only_campaign_schema.dump(updated_campaign))


@campaign_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session(campaign_id):
    try:
        current_domain = request.host_url.rstrip('/')
        if not current_domain.startswith(('http://', 'https://')):
            current_domain = f'http://{current_domain}'

        session = stripe.checkout.Session.create(
            ui_mode='embedded',
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': 1000,
                    'product_data': {
                        'name': 'Donation',
                        'description': 'One-time contribution to our cause',
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            return_url=f'{current_domain}/return?session_id={{CHECKOUT_SESSION_ID}}',
            metadata={'type': 'donation'},
        )
        return jsonify({'clientSecret': session.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@campaign_bp.route('/session-status', methods=['GET'])
def session_status(campaign_id):
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        customer_email = session.customer_details.email if session.customer_details else None
        return jsonify({
            'status': session.status,
            'customer_email': customer_email
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400