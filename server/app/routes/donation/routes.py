import uuid
import stripe
from flask import jsonify, request, current_app
from marshmallow.exceptions import ValidationError
from app.database import db
from app.routes.donation import donation_bp
from app.models.campaign import Campaign
from app.models.user import User
from app.models.payment_transaction import PaymentTransaction
from app.models.donation import Donation
from app.schemas.campaign import CampaignSchema
from app.schemas.donation import DonationSchema
from app.schemas.user import DonorSchema
from app.services.checkout_session import checkout_session

import json
from app.utils.payment_transaction import create_payment_transaction
from app.utils.user import get_or_create_donor
from app.utils.donation import create_donation
from marshmallow import EXCLUDE
from datetime import datetime
from app.utils.constants import CHARGE_PROCESS_QUEUE, DonationStatus
from sqlalchemy import func
from collections import defaultdict

from app.services.charge_handler import (
    successful_charge,
    failed_charge,
    refunded_charge,
)


@donation_bp.route("/", methods=["GET"])
def fetch_campaign():
    try:

        donors = (
            db.session.query(func.count(Donation.donor_id.distinct()))
            .filter_by(status=DonationStatus.SUCCEEDED)
            .scalar()
        )

        campaign = Campaign.query.filter_by(is_active=True).first()
        raised = (
            db.session.query(func.sum(Donation.amount))
            .filter_by(status=DonationStatus.SUCCEEDED)
            .scalar()
        )
        campaign_schema = CampaignSchema(
            only=[
                "id",
                "image_url",
                "title",
                "description",
                "raised",
                "goal",
                "total_donations",
            ]
        )
        if not campaign:
            current_app.logger.info("No active campaign found.")
            return (
                jsonify(
                    {
                        "activeCampaign": False,
                        "image_url": "",
                        "title": "",
                        "description": "",
                        "raised": raised if raised else 0,
                        "goal": 0,
                        "totalDonations": 0,
                        "donorsCount": donors,
                    }
                ),
                200,
            )
        campaign_data = campaign_schema.dump(campaign)
        campaign_data["activeCampaign"] = True
        campaign_data["donorsCount"] = donors
        current_app.logger.info(f"Active Campaign {campaign.id} successfully fetched.")
        return campaign_data, 200

    except Exception as e:
        current_app.logger.error(
            f"Failed to fetch active campaign: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Failed to fetch active campaign: {str(e)}",
                }
            ),
            500,
        )


@donation_bp.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    try:
        data = request.get_json()
        current_app.logger.info(f"Creating payment intent with data: {data}")
        active_campaign = Campaign.query.filter_by(is_active=True).first()

        donor_schema = DonorSchema(
            unknown=EXCLUDE,
            only=[
                "email_address",
                "full_name",
            ],
        )

        donation_schema = DonationSchema(
            unknown=EXCLUDE,
            only=[
                "amount",
                "is_anonymous",
            ],
        )
        validated_donor_data = donor_schema.load(data)

        donor = get_or_create_donor(
            email_address=validated_donor_data["email_address"],
            is_email_subscription=data["isEmailSubscription"],
            full_name=validated_donor_data["full_name"],
        )

        validated_donation_data = donation_schema.load(data)

        donation = create_donation(
            donor_id=donor.id,
            amount=validated_donation_data["amount"],
            is_anonymous=validated_donation_data["is_anonymous"],
        )

        if active_campaign:
            donation.campaign_id = active_campaign.id
            db.session.commit()

        idempotency_key = f"payment_{donation.id}_{uuid.uuid4()}"
        payment_transaction = create_payment_transaction(
            donation_id=donation.id,
            donor_id=donor.id,
            amount=donation.amount,
            idempotency_key=idempotency_key,
            payment_intent_id=data["paymentIntentId"],
        )

        current_app.logger.info("Payment intent created successfully.")
        return jsonify({"paymentIntentId": payment_transaction.payment_intent_id}), 200

    except ValidationError as ve:
        db.session.rollback()
        current_app.logger.error(f"Validation error: {str(ve)}", exc_info=True)
        return jsonify({"status": "failed", "message": str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error creating checkout session: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error creating checkout session: {str(e)}",
                }
            ),
            500,
        )


@donation_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()

        domain_url = current_app.config["WEB_URL"]
        active_campaign = Campaign.query.filter_by(is_active=True).first()
        payment_intent_id = data.get("paymentIntentId")

        payment_transaction = PaymentTransaction.query.filter_by(
            payment_intent_id=payment_intent_id
        ).first()
        current_app.logger.info(f"payment intent {payment_intent_id}")

        current_app.logger.info(f"payment transaction {payment_transaction}")
        donation = payment_transaction.donation
        donor = donation.donor

        session = checkout_session(
            amount=donation.amount,
            domain_url=domain_url,
            campaign_id=active_campaign.id if active_campaign else "",
            payment_transaction_id=payment_transaction.id,
            idempotency_key=payment_transaction.idempotency_key,
            donor_id=donor.id,
            donation_id=donation.id,
            email_address=donor.email_address,
            lat=data.get("lat", ""),
            lng=data.get("lng", ""),
        )

        current_app.logger.info(f"Checkout session created.")
        return (
            jsonify(
                {
                    "clientSecret": session.client_secret,
                    "status": "success",
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error creating checkout session: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error creating checkout session: {str(e)}",
                }
            ),
            500,
        )


@donation_bp.route("/check-session-status", methods=["GET"])
def check_session_status():
    try:
        session_id = request.args.get("session_id")
        session = stripe.checkout.Session.retrieve(session_id)
        current_app.logger.info(
            f"Session {session_id} status: {session.payment_status}"
        )
        return jsonify({"status": session.payment_status}), 200
    except stripe.error.StripeError as e:
        current_app.logger.error(f"Stripe error: {str(e)}", exc_info=True)
        return jsonify({"status": "failed", "message": f"Stripe error: {str(e)}"}), 500


@donation_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    try:
        payload = request.data
        sig_header = request.headers.get("Stripe-Signature")
        webhook_secret = current_app.config["STRIPE_WEBHOOK_SECRET"]

        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        event_type = event["type"]
        session = event["data"]["object"]

        if (
            event_type == "charge.succeeded"
            or event_type == "charge.failed"
            or event_type == "charge.refunded"
        ):

            metadata = session.get("metadata", {})
            charge_id = session.get("payment_intent", "")

            data = {
                "campaign_id": metadata.get("campaign_id", ""),
                "email_address": metadata.get("email_address", ""),
                "donor_id": metadata.get("donor_id", ""),
                "donation_id": metadata.get("donation_id", ""),
                "payment_transaction_id": metadata.get("payment_transaction_id", ""),
                "idempotency_key": metadata.get("idempotency_key", ""),
                "amount": metadata.get("amount", ""),  # Convert cents to dollars
                "charge_id": charge_id,
                "lat": metadata.get("lat", ""),
                "lng": metadata.get("lng", ""),
            }

            message = {
                "id": str(uuid.uuid4()),
                "timestamp": datetime.now().isoformat(),
                "value": event_type,
                "data": data,
            }

            current_app.redis.lpush(CHARGE_PROCESS_QUEUE, json.dumps(message))

        return jsonify({"status": "success"}), 200
    except Exception as e:
        current_app.logger.error(f"Webhook error: {str(e)}", exc_info=True)
        return jsonify({"status": "failed", "message": f"Webhook error: {str(e)}"}), 500
