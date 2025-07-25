from app.models.payment_transaction import PaymentTransaction
from flask import current_app


def create_payment_transaction(donation_id, donor_id, amount, idempotency_key):
    try:
        payment_transaction = PaymentTransaction(
            donation_id=donation_id,
            donor_id=donor_id,
            amount=amount,
            idempotency_key=idempotency_key,
        )
        return payment_transaction
    except Exception as e:
        current_app.logger.error(f"Error creating payment transaction: {str(e)}")
        raise ValueError("Failed to create payment transaction.")
