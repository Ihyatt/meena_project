import magic


def allowed_mime_type(file):
    mime = magic.from_buffer(file.stream.read(2048), mime=True)
    file.stream.seek(0)  # Important: reset the file pointer
    allowed_types = ["image/png", "image/jpg", "image/jpeg", "application/pdf"]
    return mime in allowed_types
