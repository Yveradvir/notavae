from base64 import b64decode, b64encode

def from_frontend(image: str | None) -> str | None:
    """Get image from frontend and decode it."""

    return b64decode(image.split(",")[1].encode()) if image else None 

def to_frontend(image: bytes | None) -> str | None:
    """Get image from database and encode it for frontend."""
    
    return b64encode(image).decode() if image else None
    