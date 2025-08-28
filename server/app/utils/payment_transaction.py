from app.models.payment_transaction import PaymentTransaction
from flask import current_app

from app.database import db


def create_payment_transaction(
    donation_id, donor_id, amount, idempotency_key, payment_intent_id
):
    try:
        payment_transaction = PaymentTransaction(
            donation_id=donation_id,
            donor_id=donor_id,
            amount=amount,
            idempotency_key=idempotency_key,
            payment_intent_id=payment_intent_id,
        )
        db.session.add(payment_transaction)
        db.session.commit()
        return payment_transaction
    except Exception as e:
        current_app.logger.error(f"Error creating payment transaction: {str(e)}")
        raise ValueError("Failed to create payment transaction.")
