from app.database import db
from app.routes.admin import admin_bp
from app.utils.decorators import admin_required
from app.models.campaign import Campaign

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required # Used to check if user is logged in
from app.utils.roles import roles_required # Your custom decorator for checking user roles
from marshmallow import ValidationError # To catch specific validation errors from schemas

from app.database import db # Your SQLAlchemy database instance
from app.models.campaign import Campaign
from app.models.user import User # Needed to verify if the provided user_id exists


from app.schemas.campaign_schema import validate_admin_create_campaign, campaign_admin_schema


@admin_bp.route('/create-campaign', methods=['POST'])
@jwt_required()
@admin_required()
def create_campaign(admin_id):
    validated_data = admin_create_campaign_schema.load(request.json)
    new_campaign = Campaign(**validated_data)
    db.session.add(new_campaign)
    db.session.commit()


@admin_bp.route('/campaigns', methods=['GET'])
@jwt_required()
@admin_required()
def campaigns(admin_id):
    try:
        campaign = db.session.query(Campaign).options(
            db.joinedload(Campaign.admin),
            db.joinedload(Campaign.donations)
                .joinedload(Donation.donor)
        ).filter_by(id=campaign_id, is_deleted=False).first()

        if not campaign:
            return jsonify({"message": "Campaign not found"}), 404

        response_data = campaign_admin_schema.dump(campaign)

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500





