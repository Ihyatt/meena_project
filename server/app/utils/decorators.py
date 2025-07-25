from functools import wraps
from flask_jwt_extended import get_jwt_identity, get_jwt_identity
from flask import jsonify
from app.models.user import User


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if user and user.is_admin:
                return fn(*args, **kwargs)
            return (
                jsonify(
                    {
                        "message": "Forbidden: You do not have permission to access this resource."
                    }
                ),
                403,
            )

        return decorator

    return wrapper
