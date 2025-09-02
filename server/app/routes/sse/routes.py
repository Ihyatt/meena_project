# Standard library imports
import json
from datetime import datetime, timezone

# Third-party imports
import stripe
from flask import current_app, jsonify, request, Response, stream_with_context
from redis import Redis
from sqlalchemy.orm.exc import StaleDataError

# Local application imports
from app.database import db
from app.models.donation_notification import DonationNotification
from app.routes.sse import sse_bp
from app.utils.constants import DONATION_NOTIFICATIONS_CHANNEL


@sse_bp.route("/init", methods=["GET"])
def init():
    current_app.logger.info("Initializing SSE connection")
    notifications = current_app.redis.zrevrange(
        "donation_notifications", 0, -1, withscores=True
    )

    deserialized_notifications = [
        {
            "full_name": json.loads(notification[0])["full_name"],
            "amount": json.loads(notification[0])["amount"],
            "notification_id": json.loads(notification[0])["notification_id"],
            "donation_id": json.loads(notification[0])["donation_id"],
            "donation_created_at": json.loads(notification[0])["donation_created_at"],
            "first_time_donor": json.loads(notification[0])["first_time_donor"],
        }
        for notification in notifications
    ]

    current_app.logger.info(
        f"Returning {len(deserialized_notifications)} past notifications"
    )
    return jsonify({"status": "success", "notifications": deserialized_notifications})


@sse_bp.route("/ack/<int:notification_id>", methods=["PATCH"])
def ack(notification_id):
    try:
        current_app.logger.info(f"Acknowledging notification {notification_id}")
        now = datetime.now(timezone.utc)

        notification = DonationNotification.query.filter_by(id=notification_id).first()
        notification.recieved_at = now
        db.session.commit()
        current_app.logger.info(
            f"Acknowled notification {notification_id} at {now.isoformat()}"
        )
        return jsonify({"message": "success"}), 200

    except StaleDataError as exc:
        current_app.logger.warning(
            f"StaleDataError when acknowledging notification {notification_id}"
        )
        db.session.rollback()
        return jsonify({"message": "stale data error, please retry"}), 409

    except Exception as exc:
        current_app.logger.exception("Error acknowledging notification")
        return jsonify({"message": "error"}), 500


@sse_bp.route("/stream")
def stream():
    current_app.logger.info("Starting SSE stream")

    def event_stream():
        current_app.logger.info("SSE stream: Setting up Redis pubsub")
        redis = Redis(host="127.0.0.1", port=6379, decode_responses=True, db=0)
        pubsub = redis.pubsub()
        pubsub.subscribe(DONATION_NOTIFICATIONS_CHANNEL)

        # Send the initial "connected" event
        current_app.logger.info("SSE stream: Sending 'connected' event.")
        yield "event: connected\ndata: {}\n\n"

        try:
            for message in pubsub.listen():
                # Graceful termination if client disconnects
                if getattr(request, "is_disconnected", False):
                    break

                if message["type"] != "message":
                    if message["type"] == "subscribe":
                        current_app.logger.info(
                            f"SSE stream: Subscribed to {message['channel']}"
                        )
                    continue

                raw_data = message["data"]
                json_str = (
                    raw_data.decode("utf-8")
                    if isinstance(raw_data, bytes)
                    else raw_data
                )

                try:
                    payload = json.loads(json_str)
                    notification_id = int(payload["notification_id"])
                    current_app.logger.info(
                        f"SSE stream: Received notification {notification_id}"
                    )
                    notification = DonationNotification.query.get(notification_id)

                    if not notification:
                        current_app.logger.error(
                            f"SSE stream: No DonationNotification with id={notification_id}"
                        )
                        raise ValueError(
                            f"No DonationNotification with id={notification_id}"
                        )

                    event_payload = json.dumps(payload)

                    # Deliver the event
                    yield f"event: donation_notification\ndata: {event_payload}\n\n"

                    # Mark as sent **only after** successful delivery
                    notification.sent_at = datetime.now(timezone.utc)
                    db.session.commit()

                    current_app.logger.info(
                        f"SSE stream: Delivered notification {notification_id}"
                    )
                except StaleDataError as exc:
                    current_app.logger.warning(
                        f"SSE stream: StaleDataError for notification {notification_id}"
                    )
                    db.session.rollback()
                    yield f"event: error\ndata: {json.dumps({'message': 'Stale data error, please retry'})}\n\n"

                except Exception as exc:
                    current_app.logger.exception("SSE stream: unhandled exception")
                    yield f"event: error\ndata: {json.dumps({'message': 'Internal error'})}\n\n"

        finally:
            pubsub.close()
            current_app.logger.info("SSE stream: connection closed")

    return Response(
        stream_with_context(event_stream()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
