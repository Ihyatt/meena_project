import magic
from flask import current_app, jsonify, request


def allowed_mime_type(file):
    mime = magic.from_buffer(file.stream.read(2048), mime=True)
    file.stream.seek(0)
    if mime in ["image/png", "image/jpeg", "application/pdf"]:
        return True

    raise ValueError(f"Invalid file type for {file}")
