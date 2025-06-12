from flask import Blueprint


campaign_bp = Blueprint('campaign', __name__, url_prefix='/campaigns/<int:campaign_id>')

from . import routes