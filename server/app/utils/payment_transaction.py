from app.models.payment_transaction import PaymentTransaction


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
        return payment_transaction
    except Exception as e:
        raise ValueError(f"Error creating payment transaction: {str(e)}")
