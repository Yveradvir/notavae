from app.core.database import db

from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Date, Uuid, LargeBinary

class UserTable(db.base, db.mixin):
    __tablename__ = 'users'
    
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    birth = Column(Date, nullable=False)
    image = Column(LargeBinary, nullable=True)

    badtokens = relationship("BadTokenTable", uselist=True, cascade="all, delete-orphan")
    memberships = relationship(
        "MembershipTable", 
        primaryjoin="UserTable.id == MembershipTable.user_id",
        foreign_keys="[MembershipTable.user_id]",
        back_populates="user", 
        uselist=True, 
        cascade="all, delete-orphan"
    )

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)


class BadTokenTable(db.base, db.mixin):
    __tablename__ = 'badtokens'

    jti = Column(String, nullable=False, unique=True)
    uid = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    ttype = Column(String, nullable=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
