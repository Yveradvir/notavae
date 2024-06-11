from app.core.database import db
from sqlalchemy import Column, String, Date

class UserTable(db.Base, db.Mixin):
    __tablename__ = 'users'
    
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    birth = Column(Date, nullable=False)
