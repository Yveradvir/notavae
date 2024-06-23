from sqlalchemy import Column, String, Date, LargeBinary, Uuid, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database.database_constant import Base, InitialMixin

class UserTable(Base, InitialMixin):
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
        foreign_keys="[MembershipTable.user_id]", back_populates="user", 
        uselist=True, cascade="all, delete-orphan"
    )

    def to_reducer_dict(self) -> dict:
        return self.to_dict(["image", "password"])

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class BadTokenTable(Base, InitialMixin):
    __tablename__ = 'badtokens'

    jti = Column(String, nullable=False, unique=True)
    uid = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    ttype = Column(String, nullable=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
