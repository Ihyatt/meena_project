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
from app.schemas.donation import donation_schema
from app.schemas.payment_transaction import payment_transaction_schema
from app.schemas.user import admin_schema, donor_schema
from user_agents import parse
from app.utils.fingerprint import get_client_fingerprint


# @campaign_bp.route('/create-checkout-session', methods=['POST'])
# def create_checkout_session():
#     print('****************')
#     print('here')

#     try:
#         session = stripe.checkout.Session.create(
#             ui_mode = 'embedded',
#             line_items=[
#                 {
#                     # Provide the exact Price ID (for example, price_1234) of the product you want to sell
#                     'price': '{{PRICE_ID}}',
#                     'quantity': 1,
#                 },
#             ],
#             mode='payment',
#             return_url=YOUR_DOMAIN + '/return?session_id={CHECKOUT_SESSION_ID}',
#         )
#     except Exception as e:
#         return str(e)

#     return jsonify(clientSecret=session.client_secret)

# @campaign_bp.route('/session-status', methods=['GET'])
# def session_status():
#   session = stripe.checkout.Session.retrieve(request.args.get('session_id'))

#   return jsonify(status=session.status, customer_email=session.customer_details.email)


# # @campaign_bp.route('/create-payment-intent', methods=['POST'])
# # def donate(campaign_id):
# #     stripe.api_key = current_app.config["STRIPE_SECRET_KEY"]
# #     data = request.get_json()
# #     ua = parse(request.user_agent.string)
# #     client_ip = request.remote_addr
    
# #     anonymous_user_id = get_client_fingerprint(
# #         client_ip,
# #         ua.os.family,
# #         ua.os.version_string, 
# #         ua.browser.family, 
# #         ua.is_mobile, 
        
# #     )
    
# #     donor = User.query.filter_by(email=email).first()
# #     anonymous_donor = User.query.filter_by(
# #         anonymous_user_id=anonymous_user_id
# #     ).first()

# #     if not donor or not anonymous_donor:
# #         donor = donor_schema(data)
# #         db.session.add(donor)
# #         db.session.commit()

# #     campaign = Campaign.query.get(campaign_id)
# #     data["campaign_id"] = campaign.id

# #     data["donor_id"] = donor.id
# #     donation = donation_schema.load(data)
# #     db.session.add(donation)
# #     db.session.commit()


# #     data["donation_id"] = donation.id
# #     data["idemportency_key"] = str(uuid.uuid4())
# #     payment_transaction = payment_transaction_schema.load(data)
# #     db.session.add(payment_transaction)
# #     db.session.commit()

# #     payment_intent = stripe.PaymentIntent.create(
# #     amount=2.0,
# #     currency='USD',
# #     metadata={
# #         'integration_version': 'flask-react-v1',
# #         'user_id': 1,
# #         'campaign_id': 1
# #     },

# #     automatic_payment_methods={"enabled": False},
# # )        

# #     return jsonify({
# #         'clientSecret': payment_intent.client_secret
# #     }), 200



# @campaign_bp.route('/update', methods=['POST'])
# @jwt_required()
# @admin_required(admin_id='admin_id')
# def update(campaign_id):
#     campaign = Campaign.query.get(campaign_id)

#     data = request.get_json()
#     updated_campaign = private_campaign_schema.load(data, instance=campaign, partial=True)

#     db.session.add(updated_campaign)
#     db.session.commit()

#     return jsonify(private_campaign_schema.dump(updated_campaign))


import logging
from flask import Blueprint, request, jsonify, current_app
import stripe
# Assuming landing_bp is defined here or imported correctly

@campaign_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session(campaign_id):
    try:
        current_domain = request.host_url.rstrip('/')
        if not current_domain.startswith(('http://', 'https://')):
            current_domain = f'http://{current_domain}'
        print(current_domain)
        print("**************************")

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