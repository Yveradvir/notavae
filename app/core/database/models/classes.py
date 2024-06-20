from app.core.database import db

from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Text, Uuid, LargeBinary

class ClassTable(db.base, db.mixin):
    __tablename__ = 'classes'
    
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False, unique=True)
    password = Column(String, nullable=False)
    image = Column(LargeBinary, nullable=True)

    author_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    author = relationship("UserTable", uselist=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
