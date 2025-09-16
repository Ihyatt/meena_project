# Standard library imports
import os
import uuid
from datetime import datetime, timezone

# Third-party imports
from flask import current_app, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import EXCLUDE
from marshmallow.exceptions import ValidationError
from dateutil import parser
from dateutil.tz import tzutc
from sqlalchemy.orm.exc import StaleDataError
from werkzeug.exceptions import NotFound

# Local application imports
from app.database import db
from app.models.campaign import Campaign
from app.models.image import Image
from app.routes.admin.campaign import campaign_bp
from app.schemas.campaign import CampaignSchema
from app.schemas.image import ImageSchema
from app.utils.decorators import admin_required
from app.utils.image_validator import allowed_mime_type
import pytz  # or use zoneinfo if on Python 3.9+


@campaign_bp.route("/", methods=["GET"])
@jwt_required()
@admin_required()
def fetch_campaigns():
    current_app.logger.info("Fetching camapigns data...")
    try:
        campaigns = (
            Campaign.query.filter(Campaign.is_draft == False)
            .order_by(Campaign.updated_at.desc())
            .all()
        )

        campaign_schema = CampaignSchema(
            many=True,
            only=[
                "id",
                "image_url",
                "title",
                "description",
                "goal",
                "raised",
                "is_active",
                "launched",
                "closeout_date",
                "total_donations",
            ],
        )

        current_app.logger.info("Campaigns data fetched.")
        return campaign_schema.dump(campaigns), 200

    except Exception as e:
        current_app.logger.error(
            f"Error fetching campaigns data: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching campaigns data: {str(e)}",
                }
            ),
            500,
        )


@campaign_bp.route("/<int:campaign_id>", methods=["GET"])
@jwt_required()
@admin_required()
def fetch_campaign(campaign_id):
    current_app.logger.info(f"Fetching campaign '{campaign_id}'...")
    try:
        campaign = Campaign.query.get_or_404(campaign_id)

        campaign_schema = CampaignSchema(
            only=[
                "id",
                "title",
                "description",
                "goal",
                "raised",
                "image_url",
                "is_active",
                "is_draft",
                "total_donations",
                "launched",
                "closeout_date",
                "created_at",
            ]
        )
        current_app.logger.info(f"Campaign '{campaign_id}' fetched successfully.")
        return campaign_schema.dump(campaign), 200

    except NotFound:
        current_app.logger.warning(f"Campaign '{campaign_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Campaign with ID '{campaign_id}' not found.",
                }
            ),
            404,
        )

    except Exception as e:
        current_app.logger.error(
            f"Error fetching campaign '{campaign_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching campaign '{campaign_id}': {str(e)}",
                }
            ),
            500,
        )


@campaign_bp.route("/<int:campaign_id>/save", methods=["PATCH", "PUT"])
@jwt_required()
@admin_required()
def save_campaign(campaign_id):
    current_app.logger.info(f"Saving campaign '{campaign_id}'...")
    try:
        data = request.get_json()
        campaign = Campaign.query.get_or_404(campaign_id)

        campaign_schema = CampaignSchema(
            unknown=EXCLUDE,
            only=[
                "id",
                "title",
                "description",
                "goal",
                "raised",
                "image_url",
                "is_active",
                "is_draft",
                "launched",
                "closeout_date",
                "total_donations",
                "created_at",
            ],
        )
        validated_data = campaign_schema.load(data)
        if data.get("closeoutDate") and data["closeoutDate"]:
            current_app.logger.info(
                f"Setting draft campaign closeout date to '{data['closeoutDate']}'"
            )

            date_string = data["closeoutDate"]
            dt = datetime.strptime(date_string, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
            dt_utc = dt.astimezone(timezone.utc)

            campaign.closeout_date = dt_utc
            current_app.logger.info(f"Draft campaign closeout date set to '{dt_utc}'")

        campaign.title = validated_data["title"]
        campaign.description = validated_data["description"]
        campaign.goal = validated_data["goal"]
        campaign.closeout_date = dt_utc

        db.session.commit()
        current_app.logger.info(f"Campaign '{campaign_id}' saved successfully.")
        return campaign_schema.dump(campaign), 200

    except ValidationError as ve:
        current_app.logger.error(
            f"Validation error while saving campaign '{campaign_id}': {str(ve)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Validation error: {str(ve)}",
                }
            ),
            400,
        )

    except StaleDataError as sde:
        current_app.logger.warning(
            f"StaleDataError when saving campaign '{campaign_id}': {str(sde)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Stale data error, please retry: {str(sde)}",
                }
            ),
            409,
        )

    except NotFound:
        current_app.logger.warning(f"Campaign '{campaign_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Campaign with ID '{campaign_id}' not found.",
                }
            ),
            404,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error saving campaign '{campaign_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "message": f"Error saving campaign '{campaign_id}': {str(e)}",
                    "status": "failed",
                }
            ),
            500,
        )


@campaign_bp.route("/<int:campaign_id>/launch", methods=["PATCH", "PUT"])
@jwt_required()
@admin_required()
def launch_campaign(campaign_id):
    current_app.logger.info(f"Launching campaign '{campaign_id}'...")
    try:
        campaign_schema = CampaignSchema(
            only=[
                "id",
                "title",
                "description",
                "goal",
                "raised",
                "image_url",
                "is_active",
                "is_draft",
                "total_donations",
                "launched",
                "closeout_date",
                "created_at",
            ]
        )

        campaign = Campaign.query.get_or_404(campaign_id)

        active_campaign = Campaign.query.filter_by(is_active=True).first()

        now = datetime.now(timezone.utc)
        if active_campaign is not None:
            active_campaign.is_active = False
            active_campaign.closeout_date = now
            db.session.commit()

        campaign.is_active = True
        campaign.launched = now
        db.session.commit()
        current_app.logger.info(f"Campaign '{campaign_id}' launched successfully.")
        return campaign_schema.dump(campaign), 200
    except NotFound:
        current_app.logger.warning(f"Campaign '{campaign_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Campaign with ID '{campaign_id}' not found.",
                }
            ),
            404,
        )
    except StaleDataError as sde:
        current_app.logger.warning(
            f"StaleDataError when launching campaign '{campaign_id}': {str(sde)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Stale data error, please retry: {str(sde)}",
                }
            ),
            409,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error launching campaign '{campaign_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "message": f"Error launching campaign '{campaign_id}': {str(e)}",
                    "status": "failed",
                }
            ),
            500,
        )


@campaign_bp.route("/<int:campaign_id>/close", methods=["PATCH", "PUT"])
@jwt_required()
@admin_required()
def close_campaign(campaign_id):
    current_app.logger.info(f"Closing campaign '{campaign_id}'...")
    try:
        campaign_schema = CampaignSchema(
            only=[
                "id",
                "title",
                "description",
                "goal",
                "raised",
                "image_url",
                "is_active",
                "is_draft",
                "total_donations",
                "launched",
                "closeout_date",
                "created_at",
            ]
        )

        now = datetime.now(timezone.utc)
        campaign = Campaign.query.get_or_404(campaign_id)
        campaign.is_active = False
        campaign.closeout_date = now

        db.session.commit()

        current_app.logger.info(f"Campaign '{campaign_id}' closed successfully.")
        return campaign_schema.dump(campaign), 200

    except NotFound:
        current_app.logger.warning(f"Campaign '{campaign_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Campaign with ID '{campaign_id}' not found.",
                }
            ),
            404,
        )

    except StaleDataError as sde:
        current_app.logger.warning(
            f"StaleDataError when closing campaign '{campaign_id}': {str(sde)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Stale data error, please retry: {str(sde)}",
                }
            ),
            409,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error closing campaign '{campaign_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "message": f"Error closing campaign '{campaign_id}': {str(e)}",
                    "status": "failed",
                }
            ),
            500,
        )


@campaign_bp.route("/draft", methods=["POST"])
@jwt_required()
@admin_required()
def fetch_or_create_draft():
    current_app.logger.info("Fetching or creating draft campaign...")
    try:
        admin_id = get_jwt_identity()

        draft_campaign = Campaign.query.filter_by(
            admin_id=admin_id,
            is_draft=True,
        ).first()

        if draft_campaign is None:
            draft_campaign = Campaign(admin_id=admin_id, is_draft=True)
            db.session.add(draft_campaign)
            db.session.commit()
            current_app.logger.info(f"Draft campaign created for admin '{admin_id}'.")

        campaign_schema = CampaignSchema(
            only=["id", "title", "description", "goal", "image_url", "closeout_date"]
        )

        current_app.logger.info(f"Draft campaign fetched for '{draft_campaign.id}'.")
        return campaign_schema.dump(draft_campaign), 200

    except StaleDataError as sde:
        current_app.logger.warning(
            f"StaleDataError when fetching or creating draft campaign: {str(sde)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Stale data error, please retry: {str(sde)}",
                }
            ),
            409,
        )
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error fetching or creating draft campaign: {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error fetching or creating draft campaign: {str(e)}",
                }
            ),
            500,
        )


@campaign_bp.route("/draft/save", methods=["PATCH"])
@jwt_required()
@admin_required()
def save_draft():
    current_app.logger.info("Saving draft campaign ...")
    try:
        data = request.get_json()

        campaign = Campaign.query.filter_by(
            is_draft=True,
        ).first_or_404()

        campaign_schema = CampaignSchema(
            unknown=EXCLUDE,
            only=[
                "id",
                "title",
                "description",
                "goal",
                "image_url",
                "closeout_date",
            ],
        )

        if data.get("closeoutDate") and data["closeoutDate"]:
            current_app.logger.info(
                f"Setting draft campaign closeout date to '{data['closeoutDate']}'"
            )

            date_string = data["closeoutDate"]
            if date_string.endswith("Z"):
                dt = datetime.fromisoformat(date_string.replace("Z", "+00:00"))
            else:
                dt = datetime.fromisoformat(date_string)
            dt_utc = dt.astimezone(timezone.utc)
            campaign.closeout_date = dt_utc

            data["closeoutDate"] = dt_utc

        if not isinstance(data["goal"], int):
            data["goal"] = 0

        validated_data = campaign_schema.load(data)
        if validated_data["title"]:
            campaign.title = validated_data["title"]

        if validated_data["description"]:
            campaign.description = validated_data["description"]

        if validated_data["goal"]:
            campaign.goal = validated_data["goal"]

        db.session.commit()

        current_app.logger.info("Draft campaign  saved successfully.")

        return campaign_schema.dump(campaign)

    except NotFound:
        current_app.logger.warning("Draft campaign not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": "Draft campaign not found.",
                }
            ),
            404,
        )
    except ValidationError as ve:
        current_app.logger.error(
            "Validation error while save draft campaign : {str(ve)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Validation error: {str(ve)}",
                }
            ),
            400,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error sharing draft campaign : {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error sharing draft campaign : {str(e)}",
                }
            ),
            500,
        )


@campaign_bp.route("/<int:campaign_id>/share-draft", methods=["PATCH"])
@jwt_required()
@admin_required()
def share_draft(campaign_id):
    current_app.logger.info(f"Sharing draft campaign '{campaign_id}'...")
    try:
        data = request.get_json()
        current_app.logger.info(f"Sharing draft campaign '{data}'...")

        campaign = Campaign.query.get_or_404(campaign_id)

        campaign_schema = CampaignSchema(unknown=EXCLUDE)

        validated_data = campaign_schema.load(data)
        if data.get("closeoutDate") and data["closeoutDate"]:
            current_app.logger.info(
                f"Setting draft campaign closeout date to '{data['closeoutDate']}'"
            )

            date_string = data["closeoutDate"]
            dt = datetime.strptime(date_string, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
            dt_utc = dt.astimezone(timezone.utc)

            campaign.closeout_date = dt_utc
            current_app.logger.info(f"Draft campaign closeout date set to '{dt_utc}'")

        campaign.title = validated_data["title"]
        campaign.description = validated_data["description"]
        campaign.goal = validated_data["goal"]
        campaign.closeout_date = dt_utc
        campaign.is_draft = False

        db.session.commit()

        current_app.logger.info(f"Draft campaign '{campaign_id}' shared successfully.")
        return jsonify({"status": "success", "message": "Draft campaign shared."}), 200

    except NotFound:
        current_app.logger.warning(f"Draft campaign '{campaign_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Draft campaign with ID '{campaign_id}' not found.",
                }
            ),
            404,
        )
    except ValidationError as ve:
        current_app.logger.error(
            f"Validation error while sharing draft campaign '{campaign_id}': {str(ve)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Validation error: {str(ve)}",
                }
            ),
            400,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error sharing draft campaign '{campaign_id}': {str(e)}", exc_info=True
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error sharing draft campaign '{campaign_id}': {str(e)}",
                }
            ),
            500,
        )


@campaign_bp.route("/<int:campaign_id>/upload", methods=["POST"])
@jwt_required()
@admin_required()
def image_upload(campaign_id):
    current_app.logger.info(f"Uploading image for campaign '{campaign_id}'...")
    try:
        file = request.files["file"]

        try:
            is_validated = allowed_mime_type(file)
            current_app.logger.info(f"File validation result: {is_validated}")
        except Exception as e:
            current_app.logger.error(f"File validation error: {str(e)}", exc_info=True)
            return (
                jsonify(
                    {"message": f"File validation error: {str(e)}", "status": "failed"}
                ),
                400,
            )
        campaign = Campaign.query.get_or_404(campaign_id)
        prev_image_url = campaign.image_url
        if prev_image_url:
            try:
                prev_image = Image.query.filter_by(url=prev_image_url).first()
                db.session.delete(prev_image)
                db.session.commit()
                current_app.logger.info(
                    f"Previous image record for campaign '{campaign_id}' deleted successfully."
                )
            except:
                current_app.logger.error(
                    f"Error deleting previous image record: {str(e)}", exc_info=True
                )

        image_schema = ImageSchema(
            only=[
                "id",
                "file_id",
                "url",
                "bucket",
                "key",
                "size",
                "content_type",
                "campaign_id",
            ]
        )

        key = f"uploads/{uuid.uuid4().hex}_{file.filename}"

        current_app.s3.upload_fileobj(
            file,
            current_app.config["BUCKET"],
            key,
            ExtraArgs={"ContentType": file.content_type},  # e.g. image/jpeg
        )
        url = f"https://{current_app.config["BUCKET"]}.s3.amazonaws.com/{key}"

        new_image = Image(
            url=f"https://{current_app.config["BUCKET"]}.s3.amazonaws.com/{key}",
            bucket=current_app.config["BUCKET"],
            key=key,
            size=file.content_length,
            content_type=file.content_type,
            campaign_id=campaign_id,
        )

        db.session.add(new_image)
        campaign.image_url = new_image.url
        db.session.commit()
        current_app.logger.info(
            f"Image for campaign '{campaign_id}' uploaded successfully."
        )
        return image_schema.dump(new_image), 201

    except NotFound:
        current_app.logger.warning(f"Campaign '{campaign_id}' not found.")
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Campaign with ID '{campaign_id}' not found.",
                }
            ),
            404,
        )
    except StaleDataError as sde:
        current_app.logger.warning(
            f"StaleDataError when uploading image for campaign '{campaign_id}': {str(sde)}"
        )
        db.session.rollback()
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Stale data error, please retry: {str(sde)}",
                }
            ),
            409,
        )

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error uploading image for campaign '{campaign_id}': {str(e)}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "status": "failed",
                    "message": f"Error uploading image for campaign '{campaign_id}': {str(e)}",
                }
            ),
            500,
        )
