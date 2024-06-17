from app.core.database import db

from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Date, Uuid

class UserTable(db.base, db.mixin):
    __tablename__ = 'users'
    
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    birth = Column(Date, nullable=False)

    badtokens = relationship("BadTokenTable", uselist=True)

class BadTokenTable(db.base, db.mixin):
    __tablename__ = 'badtokens'

    jti = Column(String, nullable=False, unique=True)
    uid = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    ttype = Column(String, nullable=False)