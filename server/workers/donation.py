import random
import json
import time

from datetime import datetime, timezone, timedelta

from workers.redis_client import redis_access
from workers.utils import backoff


from app.services.charge_handler import (
    successful_charge,
    failed_charge,
    refunded_charge,
)
from app import create_app

CHARGE_DEAD_LETTER_QUEUE = "charge_dlq"
CHARGE_RETRY_QUEUE = "charge_retry_queue"
CHARGE_PROCESS_QUEUE = "charge_process_queue"
RETRY_COUNTS = "retry_counts"
DELAYED_QUEUE = "delayed_queue"


app = create_app()


def process_message(db, message_json: str):
    try:
        message = json.loads(message_json)
        data = message["data"]

        if message["value"] == "charge.succeeded":
            successful_charge(
                donor_id=data["donor_id"],
                email_address=data["email_address"],
                campaign_id=data["campaign_id"],
                payment_transaction_id=data["payment_transaction_id"],
                donation_id=data["donation_id"],
                idempotency_key=data["idempotency_key"],
                amount=data["amount"],
                charge_id=data["charge_id"],
            )
        elif message["value"] == "charge.failed":
            failed_charge(
                payment_transaction_id=data["payment_transaction_id"],
                idempotency_key=data["idempotency_key"],
                charge_id=data["charge_id"],
            )
        elif message["value"] == "charge.refunded":
            refunded_charge(
                payment_transaction_id=data["payment_transaction_id"],
                idempotency_key=data["idempotency_key"],
                charge_id=data["charge_id"],
                campaign_id=data["campaign_id"],
            )
        db.hdel(RETRY_COUNTS, message_json)  # Clear retry count on success
        print("\t>> Processed successfully.")

    except Exception as e:

        print(f"Error processing charge: {str(e)}")
        retry_count = db.hincrby(RETRY_COUNTS, message_json, 1)

        if retry_count <= 3:
            # Move to retry queue with delay
            print("\tProcessing failed - requeuing...")
            now = int(datetime.now(timezone.utc).timestamp())
            next_retry = now + backoff(attempt=3)

            db.zadd(DELAYED_QUEUE, {message_json: next_retry})

        else:
            redis_access.redis_queue_push(db, CHARGE_DEAD_LETTER_QUEUE, message_json)
            print("\tProcessing failed - moving to dead letter queue (DLQ).")


def push_to_queue(db):
    now = int(datetime.now(timezone.utc).timestamp())

    while True:
        print("Checking for delayed tasks...")
        items = db.zpopmin(DELAYED_QUEUE, count=1)
        if not items:  # sorted-set is empty
            break
        task, score = items[0]
        if score > now:  # popped too early – put it back
            db.zadd(DELAYED_QUEUE, {task: score})
            break  # nothing else is ready

        # score <= now – task is really due; process it
        print(f"Popped task={task}  due={score}")
        redis_access.redis_queue_push(db, CHARGE_RETRY_QUEUE, task)


def main():

    with app.app_context():
        print("Starting charge worker...")

        app.redis = redis_access.redis_db()
        time.sleep(random.uniform(0.5, 1.5))  # Simulate some startup delay

        while True:
            print("Waiting for messages in the charge process queue...")
            push_to_queue(app.redis)

            message_json = redis_access.redis_queue_pop(app.redis, CHARGE_PROCESS_QUEUE)
            print(f"Processing message: {message_json}")
            process_message(app.redis, message_json)


if __name__ == "__main__":
    print("Launching worker...")
    main()
    print("Worker terminated successfully.")
