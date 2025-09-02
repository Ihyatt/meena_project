# Third-party imports
from flask import current_app, jsonify, request
from flask_jwt_extended import create_access_token
from marshmallow.exceptions import ValidationError

# Local application imports
from app.models.user import User
from app.routes.auth import auth_bp
from app.schemas.user import LoginSchema


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        login_schema = LoginSchema()
        validated_data = login_schema.load(data)

        password = data["password"]
        email_address = validated_data["email_address"]
        user = User.query.filter_by(email_address=email_address).first()

        if not user:
            current_app.logger.warning(
                f"User with email '{email_address}' does not exist."
            )
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"User with email '{email_address}' does not exist.",
                    }
                ),
                404,
            )

        if user.is_admin == False:
            current_app.logger.warning(
                f"User with email '{email_address}' is not an Admin."
            )
            return (
                jsonify(
                    {
                        "status": "failed",
                        "message": f"User with email {email_address} is not an Admin.",
                    }
                ),
                403,
            )

        if not user.check_password(password):
            current_app.logger.warning(f"Invalid password.")
            return jsonify({"status": "failed", "message": "Invalid password."}), 400

        jwt_token = create_access_token(identity=str(user.id))

        current_app.logger.info("Login successful.")
        return jsonify({"jwtToken": jwt_token, "status": "success"}), 200

    except ValidationError as ve:
        current_app.logger.warning(f"Validation error: {ve.messages}")
        return jsonify({"status": "failed", "message": ve.messages}), 400

    except Exception as e:
        current_app.logger.error(f"Login failed: {str(e)}", exc_info=True)
        return jsonify({"status": "failed", "message": f"Login failed: {str(e)}"}), 500
