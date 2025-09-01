import uuid
from app.database import db

from flask import current_app
from app import create_app
from app.utils.constants import (
    SubscriptionStatus,
    EmailType,
    JobStatus,
    TaskName,
    PaymentStatus,
)
from app.utils.email import create_email
from app.models.email_subscription import EmailSubscription
from app.models.campaign import Campaign
from app.models.task import Task
from app.models.payment_transaction import PaymentTransaction
from app.models.donation import Donation
import stripe

from app.models.task import Task
from app.models.email import Email
from app.services.email_handler import send_impact_email, send_closeout_email
from datetime import datetime
from flask import jsonify, request, current_app, Response, json, stream_with_context
from sqlalchemy import func
from app.utils.constants import DonationStatus
from datetime import datetime, timezone, timedelta

import random
from tenacity import retry, wait_fixed, wait_random, stop_after_attempt


class ReconcilePayments:
    def __init__(self):
        self.payments = self.__call_stripe()

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(3) + wait_random(0, 2))
    def __call_stripe(self):
        today = datetime.now(timezone.utc)
        twelve_hours_ago = today.today() - timedelta(hours=12)
        payouts = stripe.PaymentIntent.list(
            created={
                "gte": int(twelve_hours_ago.timestamp()),
                "lte": int(today.timestamp()),
            },
            limit=100,
        )
        return payouts.data

    def reconcile(self, payment):
        try:
            current_app.logger.info(f"Reconciling payment: {payment.id}")

            amount = payment.amount_received / 100
            charge_id = payment.id
            status = payment.status
            metadata = payment.metadata
            idempotency_key = metadata.get("idempotency_key")

            payment_transaction = PaymentTransaction.query.filter_by(
                charge_id=charge_id, idempotency_key=idempotency_key
            ).first()

            if not payment_transaction:
                current_app.logger.warning(
                    f"No payment transaction found for charge_id: {charge_id} with idempotency_key: {idempotency_key}"
                )
                return False

            if status == "succeeded":
                payment_transaction.status = PaymentStatus.SUCCEEDED
                payment_transaction.donation.status = DonationStatus.SUCCEEDED
                payment_transaction.amount = amount
                payment_transaction.donation.amount = amount

            else:
                payment_transaction.status = PaymentStatus.FAILED
                payment_transaction.amount.amount = amount
                payment_transaction.donation.amount = amount

            payment_transaction.reconciled_at = datetime.now(timezone.utc)
            payment_transaction.donation.reconciled_at = datetime.now(timezone.utc)
            db.session.commit()
            current_app.logger.info(f"Reconciled payment: {payment.id} successfully.")
            return True
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error reconciling payment: {str(e)}")
            return False

    def run_service(self):
        current_app.logger.info(f"Found {len(self.payments)} payments to reconcile.")
        for payment in self.payments:
            new_task = Task()
            new_task.task_name = TaskName.PAYMENT.value
            new_task.charge_id = payment.id
            status = self.reconcile(payment)
            if status:
                new_task.status = JobStatus.SUCCEEDED
            else:
                new_task.status = JobStatus.FAILED
            new_task.ended_at = datetime.now(timezone.utc)
            db.session.add(new_task)
            db.session.commit()


def reconcile_payment():
    current_app.logger.info("Starting Reconcile Payments Service...")
    rp = ReconcilePayments()
    rp.run_service()
    current_app.logger.info("Reconcile Payments Service Completed.")


class ReconcileRefunds:
    def __init__(self):
        self.refunds = self.__call_stripe()

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(3) + wait_random(0, 2))
    def __call_stripe(self):
        today = datetime.now(timezone.utc)
        twelve_hours_ago = today.today() - timedelta(hours=12)

        refunds = stripe.Refund.list(
            created={
                "gte": int(twelve_hours_ago.timestamp()),
                "lte": int(today.timestamp()),
            },
            limit=100,
        )
        return refunds.data

    def reconcile(self, refund):
        try:
            current_app.logger.info(f"Reconciling payment: {refund.id}")

            amount = refund.amount / 100
            charge_id = refund.payment_intent
            status = refund.status

            payment_transaction = PaymentTransaction.query.filter_by(
                charge_id=charge_id
            ).first()

            if payment_transaction.status == PaymentStatus.REFUNDED:
                current_app.logger.info(f"Refund: {refund.id} already reconciled.")
                return True

            if status == "succeeded":
                payment_transaction.status = PaymentStatus.REFUNDED
                payment_transaction.amount = amount
                payment_transaction.donation.amount = amount

            payment_transaction.reconciled_at = datetime.now(timezone.utc)
            payment_transaction.donation.reconciled_at = datetime.now(timezone.utc)
            db.session.commit()
            current_app.logger.info(f"Reconciled refund: {refund.id} successfully.")
            return True
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error reconciling refund: {str(e)}")
            return False

    def run_service(self):
        current_app.logger.info(f"Found {len(self.refunds)} refund to reconcile.")
        for refund in self.refunds:
            new_task = Task()
            new_task.task_name = TaskName.REFUND.value
            status = self.reconcile(refund)
            if status:
                new_task.status = JobStatus.SUCCEEDED
            else:
                new_task.status = JobStatus.FAILED
            new_task.ended_at = datetime.now(timezone.utc)

            db.session.add(new_task)
            db.session.commit()


def reconcile_payments():
    current_app.logger.info("Starting Reconcile Payments Service...")
    rp = ReconcilePayments()
    rp.run_service()
    current_app.logger.info("Reconcile Payments Service Completed.")


def reconcile_refunds():
    current_app.logger.info("Starting Reconcile Payments Service...")
    rr = ReconcileRefunds()
    rr.run_service()
    current_app.logger.info("Reconcile Payments Service Completed.")


def reconcile_active_campaign():
    try:
        current_app.logger.info("Reconciling active campaign...")
        active_campaign = Campaign.query.filter_by(is_active=True).first()
        if not active_campaign:
            return

        donations = Donation.query.filter_by(
            campaign_id=active_campaign.id, status=DonationStatus.SUCCEEDED
        ).all()

        reconciled_raised = 0
        reconciled_total_donations = len(donations)
        now = datetime.now(timezone.utc).date()

        for donation in donations:
            reconciled_raised += donation.amount

        now = datetime.now()
        active_campaign.raised = reconciled_raised
        active_campaign.total_donations = reconciled_total_donations

        active_campaign.reconciled_at = now
        db.session.commit()
        current_app.logger.info("Reconciliation complete.")
    except Exception as e:
        current_app.logger.error(f"Error during reconciliation: {str(e)}")
