import config
import random
import json
import time


from redis_module import redis_access


from app.services.charge_handler import (
    successful_charge,
    failed_charge,
    refunded_charge,
)

CHARGE_DLQ = "charge_dlq"
CHARGE_RQ = "charge_rq"
CHARGE_PQ = "charge_pq"


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
        db.hdel("retry_counts", message_json)  # Clear retry count on success
        print("\t>> Processed successfully.")

    except Exception as e:
        print(f"Error processing charge: {str(e)}")
        retry_count = redis_access.hincrby("retry_counts", message_json, 1)

        if retry_count <= 3:
            # Move to retry queue with delay
            print("\tProcessing failed - requeuing...")
            redis_access.redis_queue_push(db, CHARGE_RQ, message_json)
        else:
            redis_access.redis_queue_push(db, CHARGE_DLQ, message_json)
            print("\tProcessing failed - moving to dead letter queue (DLQ).")


def main():

    db = redis_access.redis_db(config)

    while True:
        message_json = redis_access.redis_queue_pop(db, CHARGE_PQ)

        process_message(db, message_json)


if __name__ == "__main__":
    print("Launching worker...")
    main()
    print("Worker terminated successfully.")
