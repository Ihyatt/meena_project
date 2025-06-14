from flask import Blueprint

admin_bp = Blueprint('admin', __name__, url_prefix='/admins/<int:admin_id>')

from . import routes