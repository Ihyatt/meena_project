from app.routes.sse import sse_bp
import uuid
import stripe
from app.routes.donation import donation_bp
from marshmallow import EXCLUDE
import uuid
from app.database import db
from redis import Redis


from retrying import retry
from app.utils.constants import (
    PaymentStatus,
    EmailType,
    DONATION_NOTIFICATIONS,
    MAX_DONATION_NOTIFICATIONS,
    DONATION_NOTIFICATIONS_CHANNEL,
)
from datetime import datetime, timezone

from app.models.campaign import Campaign
from flask import jsonify, request, current_app, Response, json, stream_with_context
from app.schemas.campaign import CampaignSchema
from app.schemas.donation import DonationSchema
from app.models.donation_notification import DonationNotification

from app.schemas.user import DonorSchema

from app.services.checkout_session import CheckoutSession

from app.utils.user import get_or_create_donor
from app.utils.donation import create_donation
from app.utils.payment_transaction import create_payment_transaction


@sse_bp.route("/init", methods=["GET"])
def init():

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
        }
        for notification in notifications
    ]

    current_app.logger.info(
        f"Initialized SSE with {deserialized_notifications} notifications."
    )
    return jsonify({"status": "success", "notifications": deserialized_notifications})


@sse_bp.route("/ack/<int:notification_id>", methods=["PATCH"])
def ack(notification_id):
    now = datetime.now(timezone.utc)
    current_app.logger.info(
        f"Acknowledging notification {notification_id} at {now.isoformat()}"
    )
    notification = DonationNotification.query.filter_by(id=notification_id).first()
    notification.recieved_at = now
    db.session.commit()

    return jsonify({"message": "success"})


@sse_bp.route("/stream")
def stream():
    """
    Server-Sent Events endpoint that pushes donation notifications
    to connected browsers in real time.
    """
    app = current_app._get_current_object()

    def event_stream():

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
                    notification = DonationNotification.query.get(notification_id)

                    if not notification:
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
