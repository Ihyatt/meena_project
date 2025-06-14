import logging
from flask import jsonify, request
from app.routes.auth import auth_bp
from app.models.user import User
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from app.database import db
from sqlalchemy.orm.exc import StaleDataError
from app.schemas.user import login_schema


logger = logging.getLogger(__name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    
    data = request.get_json()
    login_credentials = login_schema.load(data)

    email = login_credentials["email"]
    password = login_credentials["password"]
    user = User.query.filter_by(email=email).first()
    
    if not user or user.is_admin == False:
        return jsonify({"error": "Invalid user"})

    jwt_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": f"Welcome back, {user.first_name}!",
        "jwtToken": jwt_token
    }), 200
  

@auth_bp.route('/logout', methods=['POST'])
@jwt_required
def logout():
    """
        I am in progress with serializers
        Will set up Block list of JWT Tokens maybe tomorrow
    
    """
    pass