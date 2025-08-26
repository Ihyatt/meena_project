from flask import Blueprint

donor_bp = Blueprint("donor", __name__, url_prefix="/donors")
from . import routes
