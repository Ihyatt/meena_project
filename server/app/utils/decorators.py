from functools import wraps

from flask import make_response
from flask_jwt_extended import get_current_user
from app.models.user import User



def admin_required(admin_id:int):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()

            if current_user_id != admin_id:
                return jsonify(error="user_ids do not match")

            user = User.query.get(current_user_id)
            target_admin = User.query.get(admin_id)
            
            if user and target_admin and user.is_admin:
                return fn(*args, **kwargs)
            return jsonify({"message": "Forbidden: You do not have permission to access this resource."}), 403
        return decorator
    return wrapper