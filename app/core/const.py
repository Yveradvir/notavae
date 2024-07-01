from app.core.security.jwt_security import JwtSecurity, JwtConfig, cookie_names
from app.core.database import db
from app.core.settings import CoreSettings

from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine
from sqlalchemy.orm import selectinload
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

cryptcontext = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwtsecure = JwtSecurity(
    JwtConfig(
        secret_key=getenv("SECRET_KEY")
    )
)
settings = CoreSettings(
    max_memberships_per_user=15,
    max_memberships_per_course=30,
    max_asso_per_course=5,
    pagination_unit=5
)