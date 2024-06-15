from app.core.database import db
from sqlalchemy import Column, String, Date

class UserTable(db.base, db.mixin):
    __tablename__ = 'users'
    
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    birth = Column(Date, nullable=False)


class BadTokenTable(db.base, db.mixin):
    __tablename__ = 'badtokens'

    jti = Column(String, nullable=False, unique=True)
    ttype = Column(String, nullable=False)