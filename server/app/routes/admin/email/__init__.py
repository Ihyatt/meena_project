from flask import Blueprint

email_bp = Blueprint('email', __name__, url_prefix='/emails')

from . import routes


