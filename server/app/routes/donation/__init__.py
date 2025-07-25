from flask import Blueprint


donation_bp = Blueprint('donation', __name__, url_prefix='/donations')

from . import routes