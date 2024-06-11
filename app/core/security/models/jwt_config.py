from pydantic import BaseModel
from datetime import timedelta

class CookieNames(BaseModel):
    access_token_cookie: str = "access_token"
    access_token_csrf: str = "access_csrf"

    refresh_token_cookie: str = "refresh_token"
    refresh_token_csrf: str = "refresh_csrf"

class JwtConfig(BaseModel):
    access_token_life: float = timedelta(minutes=25).total_seconds
    access_token_triger: float = timedelta(minutes=20).total_seconds

    refresh_token_life: float = timedelta(hours=2).total_seconds

    secret_key: str
    secure: bool = False
