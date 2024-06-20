from base64 import b64decode, b64encode

def from_frontend(image: str | None) -> str | None:
    """Get image from frontend and decode it."""
    
    if image is not None:
        image = b64decode(image.encode()).decode()

    return image

def to_frontend(image: bytes | None) -> str | None:
    """Get image from database and encode it for frontend."""
    
    if image is not None:
        image = b64encode(image.decode()).decode()
    return image