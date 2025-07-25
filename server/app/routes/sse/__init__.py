from flask import Blueprint


sse_bp = Blueprint('sse', __name__, url_prefix='/events')

from . import routes