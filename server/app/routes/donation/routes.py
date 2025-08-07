import uuid
import stripe
from retrying import retry
from flask import jsonify, request, current_app
from marshmallow.exceptions import ValidationError
from werkzeug.exceptions import NotFound
from app.database import db
from app.routes.donation import donation_bp
from app.models.campaign import Campaign
from app.models.master_campaign import MasterCampaign
from app.schemas.campaign import CampaignSchema
from app.schemas.donation import DonationSchema
from app.schemas.master_campaign import MasterCampaignSchema
from app.schemas.user import DonorSchema
from app.services.checkout_session import CheckoutSession
from app.services.charge_handler import (
    successful_charge,
    failed_charge,
    refunded_charge,
)
import json
from app.utils.payment_transaction import create_payment_transaction
from app.utils.user import get_or_create_donor
from app.utils.donation import create_donation
from marshmallow import EXCLUDE
import asyncio
from datetime import datetime, timedelta, timezone
from app.utils.constants import CHARGE_MESSAGE_QUEUE


@donation_bp.route("/", methods=["GET"])
def fetch_campaign():
    try:
        campaign = Campaign.query.filter_by(is_active=True).first()
        master_campaign = MasterCampaign.query.first()
        master_campaign_schema = MasterCampaignSchema()
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
        current_app.logger.info(f"Active Campaign {campaign.id} successfully fetched.")
        current_app.logger.info(
            f"Master Campaign {master_campaign.id} successfully fetched."
        )
        return (
            jsonify(
                {
                    "campaign": campaign_schema.dump(campaign),
                    "masterCampaign": master_campaign_schema.dump(master_campaign),
                }
            ),
            200,
        )

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


@donation_bp.route("create-subscription-checkout-session", methods=["POST"])
def create_subscription_checkout_session():
    try:
        data = request.get_json()
        active_campaign = Campaign.query.filter_by(is_active=True).first()
        domain_url = current_app.config["WEB_URL"]
        donor_schema = DonorSchema(
            unknown=EXCLUDE,
            only=[
                "email_address",
                "subscribed",
            ],
        )

        donation_schema = DonationSchema(
            unknown=EXCLUDE,
            only=[
                "amount",
                "donor_id",
            ],
        )
        validated_donor_data = donor_schema.load(data)

        donor = get_or_create_donor(
            validated_donor_data["email_address"],
            validated_donor_data["subscribed"],
            validated_donor_data["is_anonymous"],
        )

        db.session.add(donor)
        db.session.commit()

        combined = {
            **data,
            "donorId": donor.id,
            "campaignId": campaign_id,
        }

        validated_donation_data = donation_schema.load(combined)

        donation = create_donation(
            donor.id,
            campaign_id,
            validated_donation_data["amount"],
            validated_donation_data["lat"],
            validated_donation_data["lng"],
        )
        db.session.add(donation)
        db.session.commit()

        idempotency_key = f"payment_{donation.id}_{uuid.uuid4()}"
        payment_transaction = create_payment_transaction(
            donation.id, donor.id, donation.amount, idempotency_key
        )
        db.session.add(payment_transaction)
        db.session.commit()

        checkout_session = CheckoutSession(
            donation.amount,
            domain_url,
            campaign_id,
            payment_transaction.id,
            idempotency_key,
            donor.id,
            donation.id,
            donor.email_address,
        )

        session = checkout_session.create_checkout_session()

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
    except ValidationError as ve:
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
async def stripe_webhook():
    try:
        payload = request.data
        sig_header = request.headers.get("Stripe-Signature")
        webhook_secret = current_app.config["STRIPE_WEBHOOK_SECRET"]

        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        event_type = event["type"]
        session = event["data"]["object"]
        current_app.logger.info(f"Received event: {session}")

        metadata = session.get("metadata", {})

        data = {
            "campaign_id": metadata.get("campaign_id", ""),
            "email_address": metadata.get("email_address", ""),
            "donor_id": metadata.get("donor_id", ""),
            "payment_transaction_id": metadata.get("payment_transaction_id", ""),
            "idempotency_key": metadata.get("idempotency_key", ""),
            "amount": metadata.get("amount", ""),
            "charge_id": session.get("payment_intent", ""),
        }

        message = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "value": event_type,
            "data": data,
        }
        CHARGE_PROCESS_QUEUE = "charge_process_queue"

        current_app.redis.lpush(CHARGE_PROCESS_QUEUE, json.dumps(message))

        return jsonify({"status": "success"}), 200
    except Exception as e:
        current_app.logger.error(f"Webhook error: {str(e)}", exc_info=True)
        return jsonify({"status": "failed", "message": f"Webhook error: {str(e)}"}), 500
