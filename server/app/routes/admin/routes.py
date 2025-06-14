from app.database import db
from app.routes.admin import admin_bp
from app.utils.decorators import admin_required
from app.models.campaign import Campaign

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required 
from marshmallow import ValidationError 

from app.database import db 
from app.models.campaign import Campaign
from app.models.user import User
from app.schemas.campaign import (
    write_only_campaign_schema,
    read_only_campaign_list_schema,
)


@admin_bp.route('/campaigns', methods=['POST'])
@jwt_required()
@admin_required(admin_id='admin_id')
def create_campaign(admin_id):
    data = request.get_json()
    data["admin_id"] = admin_id
    campaign = write_only_campaign_schema.load(data)
    db.session.add(campaign)
    db.session.commit()
    return jsonify(write_only_campaign_schema.dump(campaign))


@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required(admin_id='admin_id')
def dashboard(admin_id):
    campaigns = Campaign.query.all()
    return jsonify(read_only_campaign_list_schema.dump(campaigns))



