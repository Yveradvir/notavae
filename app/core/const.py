from app.core.security.jwt_security import JwtSecurity, JwtConfig
from app.core.database import db

from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine
from sqlalchemy import select, delete

from passlib.context import CryptContext
from os import path, getenv
from dotenv import load_dotenv
from base64 import b64decode, b64encode

load_dotenv(
    path.join(
        path.dirname(__file__), 
        '..', '..', '.env'
    )
)

cryptcontext = CryptContext()
jwtsecure = JwtSecurity(
    JwtConfig(
        secret_key=getenv("SECRET_KEY")
    )
)
