import stripe
from flask import current_app


def checkout_session(
    amount,
    domain_url,
    campaign_id,
    payment_transaction_id,
    idempotency_key,
    donor_id,
    donation_id,
    email_address,
    lat,
    lng,
):
    try:
        session = stripe.checkout.Session.create(
            ui_mode="embedded",
            line_items=[
                {
                    "price_data": {
                        "unit_amount": str(int(amount * 100)),  # Convert to cents
                        "product_data": {
                            "name": "donation",
                            "description": "one-time donation",
                        },
                        "currency": "USD",  # Change to your desired currency
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            return_url=domain_url
            + "checkout-complete?session_id={CHECKOUT_SESSION_ID}",
            metadata={
                "campaign_id": str(campaign_id) if campaign_id else "",
                "donor_id": str(donor_id),
                "payment_transaction_id": str(payment_transaction_id),
                "donation_id": str(donation_id),
                "idempotency_key": str(idempotency_key),
                "email_address": str(email_address),
                "amount": str(amount),
                "lat": str(lat) if lat else "",
                "lng": str(lng) if lng else "",
            },
            payment_intent_data={
                "metadata": {
                    "campaign_id": str(campaign_id),
                    "donor_id": str(donor_id),
                    "payment_transaction_id": str(payment_transaction_id),
                    "donation_id": str(donation_id),
                    "idempotency_key": str(idempotency_key),
                    "email_address": str(email_address),
                    "amount": str(amount),
                    "lat": str(lat) if lat else "",
                    "lng": str(lng) if lng else "",
                },
            },
            idempotency_key=idempotency_key,
        )
        current_app.logger.info(f"Checkout session created with ID: {session.id}")
        return session
    except Exception as e:
        current_app.logger.error(
            f"Error creating checkout session: {str(e)}", exc_info=True
        )
        raise ValueError(f"Error creating checkout session: {str(e)}")
