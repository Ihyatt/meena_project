import logging
# The other imports you had
from flask import Blueprint, request, jsonify, current_app
import stripe
from app.routes.donor import landing_bp
# Assuming landing_bp is defined here or imported correctly

@landing_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
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

@landing_bp.route('/session-status', methods=['GET'])
def session_status():
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