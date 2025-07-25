"""
------------------------------------------------------------------------
Worker Instance.

Workers listen to the redis queue and process messages.


: 08.11.23
: zach wolpe
: zach.wolpe@medibio.com.au
------------------------------------------------------------------------
"""

from app.utils.constants import CH_MESSAGE_QUEUE

import config
import random
import json


from redis_module import redis_access


def process_message(db, message_json: str):
    message = json.loads(message_json)
    print(
        f"Message received: id={message['id']}, message_number={message['data']['message_no']}"
    )

    # mimic potential processing errors
    processed_ok = random.choices((True, False), weights=(5, 1), k=1)[0]
    if processed_ok:
        print("\t>> Processed successfully.")
    else:
        print("\tProcessing failed - requeuing...")
        redis_access.redis_queue_push(db, "cron_message_queue", message_json)


def main():
    """
    Consumes items from the Redis queue.
    """

    # connect to Redis
    db = redis_access.redis_db(config)

    while True:
        message_json = redis_access.redis_queue_pop(
            db, "cron_message_queue"  # Use the correct queue name
        )  # this blocks until an item is received
        process_message(db, message_json)


if __name__ == "__main__":
    print("Launching worker...")
    main()
    print("Worker terminated successfully.")
