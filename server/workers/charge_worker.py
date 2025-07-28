import config
import random
import json
import time

from datetime import datetime, timezone, timedelta

from redis_module import redis_access
from workers.utils import backoff


from app.services.charge_handler import (
    successful_charge,
    failed_charge,
    refunded_charge,
)

CHARGE_DEAD_LETTER_QUEUE = "charge_dlq"
CHARGE_RETRY_QUEUE = "charge_retry_queue"
CHARGE_PROCESS_QUEUE = "charge_process_queue"
RETRY_COUNTS = "retry_counts"
DELAYED_QUEUE = "delayed_queue"


def process_message(db, message_json: str):
    try:
        message = json.loads(message_json)
        data = message["data"]["message"]

        if message["value"] == "charge.succeeded":
            successful_charge(
                data["donor_id"],
                data["email_address"],
                data["campaign_id"],
                data["payment_transaction_id"],
                data["idempotency_key"],
                data["amount"],
                data["charge_id"],
            )
        elif message["value"] == "charge.failed":
            failed_charge(
                data["payment_transaction_id"],
                data["idempotency_key"],
                data["charge_id"],
            )
        elif message["value"] == "charge.refunded":
            refunded_charge(
                data["payment_transaction_id"],
                data["idempotency_key"],
                data["charge_id"],
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

            db.zadd(DELAYED_QUEUE, {task: next_retry})

        else:
            db.redis_queue_push(db, CHARGE_DLQ, message_json)
            print("\tProcessing failed - moving to dead letter queue (DLQ).")


def push_to_queue(db):
    now = int(datetime.now(timezone.utc).timestamp())

    while True:
        items = db.zpopmin(DELAYED_QUEUE, count=1)
        if not items:  # sorted-set is empty
            break
        task, score = items[0]
        if score > now:  # popped too early – put it back
            db.zadd(DELAYED_QUEUE, {task: score})
            break  # nothing else is ready

        # score <= now – task is really due; process it
        print(f"Popped task={task}  due={score}")
        db.redis_queue_push(db, CHARGE_RETRY_QUEUE, message_json)


def main():

    db = redis_access.redis_db(config)

    while True:
        push_to_queue(db)
        message_json = redis_access.redis_queue_pop(db, CHARGE_PROCESS_QUEUE)
        process_message(db, message_json)


if __name__ == "__main__":
    print("Launching worker...")
    main()
    print("Worker terminated successfully.")
