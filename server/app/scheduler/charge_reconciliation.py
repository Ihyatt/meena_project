from app.database import db
import stripe
from app.models.task import Task
from app.models.payment_transaction import PaymentTransaction
from app.utils.constants import JobStatus
from flask import current_app

from retrying import retry

from datetime import datetime, timedelta
from datetime import datetime, timezone


# function chould call a class


@retry(
    wait_exponential_multiplier=1000,
    wait_exponential_max=10000,
    stop_max_attempt_number=3,
)
async def charge_query(now):
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=7)
    payment_intents = stripe.PaymentIntent.list(
        created={"gte": int(start_date.timestamp), "lt": int(now.timestamp)},
        expand=["charges.data"],
    )

    return payment_intents


async def charge_reconciliation():
    try:
        now = datetime.now(timezone.utc)
        payment_intents = await charge_query(now)
        for payment_intent in payment_intents.auto_paging_iter():
            new_task = Task(
                job_id="charge_reconciliation",
                modal="paymenttransaction",
                charge_id=payment_intent.id,
            )
            try:
                payment_transaction = PaymentTransaction.query.filter_by(
                    charge_id=payment_intent.id
                ).first()
                payment_transaction.status = payment_intent.status
                payment_transaction.last_reconciled = now
                payment_transaction.amount = payment_intent.amount / 100
                new_task = JobStatus.SUCCEEDED
                new_task.ended_at = now
                db.session.commit()
                current_app.logger.info(f"charge reconciled for {payment_intent.id}")
            except Exception as e:
                new_task = JobStatus.FAILED
                new_task.ended_at = now
                current_app.logger.error(str(e))
                db.session.commit()

    except Exception as e:
        current_app.logger.error(str(e))
