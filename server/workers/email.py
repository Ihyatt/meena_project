# Standard library imports
import json
import random
import time
from datetime import datetime, timedelta, timezone

# Local application imports
from app import create_app
from app.services.email_handler import (
    send_closeout_email,
    send_impact_email,
    send_receipt_email,
)
from app.utils.constants import EMAIL_TYPE
from workers.redis_client import redis_access
from workers.utils import backoff

# Constants
EMAIL_DEAD_LETTER_QUEUE = "email_dlq"
EMAIL_RETRY_QUEUE = "email_retry_queue"
EMAIL_PROCESS_QUEUE = "email_process_queue"
RETRY_COUNTS = "retry_counts"
DELAYED_QUEUE = "delayed_queue"


app = create_app()


def process_message(db, message_json: str):

    try:
        message = json.loads(message_json)
        data = message["data"]
        print(message)

        if message["value"] == EMAIL_TYPE.RECEIPT.value:
            send_receipt_email(
                data["donor_id"],
                data["email_address"],
                data["amount"],
                data["email_id"],
            )

        elif message["value"] == EMAIL_TYPE.IMPACT.value:
            send_impact_email(
                data["donor_id"],
                data["email_address"],
                data["campaign_id"],
                data["email_id"],
            )

        elif message["value"] == EMAIL_TYPE.CLOSEOUT.value:
            send_closeout_email(
                data["donor_id"],
                data["email_address"],
                data["campaign_id"],
                data["email_id"],
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
            redis_access.redis_queue_push(db, EMAIL_DEAD_LETTER_QUEUE, message_json)
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
        redis_access.redis_queue_push(db, EMAIL_RETRY_QUEUE, task)


def main():

    with app.app_context():
        print("Starting email worker...")

        app.redis = redis_access.redis_db()
        time.sleep(random.uniform(0.5, 1.5))  # Simulate some startup delay

        while True:
            print("Waiting for messages in the email process queue...")
            push_to_queue(app.redis)

            message_json = redis_access.redis_queue_pop(
                app.redis, "email_process_queue"
            )
            print(f"Processing message: {message_json}")
            process_message(app.redis, message_json)


if __name__ == "__main__":
    print("Launching worker...")
    main()
    print("Worker terminated successfully.")
