import stripe
from flask import current_app


class CheckoutSession:
    def __init__(
        self,
        amount,
        domain_url,
        campaign_id,
        payment_transaction_id,
        idempotency_key,
        donor_id,
        donation_id,
        email_address,
    ):
        self.amount = amount
        self.domain_url = domain_url
        self.campaign_id = campaign_id
        self.payment_transaction_id = payment_transaction_id
        self.idempotency_key = idempotency_key
        self.donor_id = donor_id
        self.donation_id = donation_id
        self.email_address = email_address

    def create_checkout_session(self):
        try:
            session = stripe.checkout.Session.create(
                ui_mode="embedded",
                line_items=[
                    {
                        "price_data": {
                            "unit_amount": str(
                                int(self.amount * 100)
                            ),  # Convert to cents
                            "product_data": {
                                "name": "Donation",
                                "description": "One-time donation",
                            },
                            "currency": "USD",
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                return_url=self.domain_url
                + "checkout-complete?session_id={CHECKOUT_SESSION_ID}",
                metadata={
                    "campaign_id": str(self.campaign_id),
                    "donor_id": str(self.donor_id),
                    "payment_transaction_id": str(self.payment_transaction_id),
                    "donation_id": str(self.donation_id),
                    "idempotency_key": self.idempotency_key,
                    "email_address": self.email_address,
                    "amount": self.amount,
                },
                payment_intent_data={
                    "metadata": {
                        "campaign_id": str(self.campaign_id),
                        "donor_id": str(self.donor_id),
                        "payment_transaction_id": str(self.payment_transaction_id),
                        "donation_id": str(self.donation_id),
                        "idempotency_key": self.idempotency_key,
                        "email_address": self.email_address,
                        "amount": self.amount,
                    },
                },
                idempotency_key=self.idempotency_key,
            )
            current_app.logger.info(f"Chekout session created with ID: {session.id}")
            return session
        except Exception as e:
            current_app.logger.error(
                f"Error creating checkout session: {str(e)}", exc_info=True
            )
            raise ValueError(f"Error creating checkout session: {str(e)}")
