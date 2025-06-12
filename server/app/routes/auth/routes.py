import logging
from flask import jsonify, request
from app.routes.auth import auth_bp
from app.models.user import User
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from app.database import db
from sqlalchemy.orm.exc import StaleDataError
from server.app.schemas.user import admin_login_schema



logger = logging.getLogger(__name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    jwt_token = create_access_token(identity=str(user.id))
    validate_admin_login_schema = admin_login_schema.load(request_json_data)
    
    return jsonify({
        "message": f"Welcome back, {user.username}!",
        "jwtToken": jwt_token
    }), 200
  


@auth_bp.route('/logout', methods=['POST'])
@jwt_required
def logout():
    #block jwt token in redis here
    pass