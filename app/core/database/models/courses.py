from app.core.database import db
from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Text, Uuid, LargeBinary

class CourseTable(db.base, db.mixin):
    __tablename__ = 'courses'
    
    name = Column(String, nullable=False, unique=True)

    description = Column(Text, nullable=False)
    password = Column(String, nullable=True)
    image = Column(LargeBinary, nullable=True)
    author_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    
    author = relationship("UserTable", uselist=False)
    memberships = relationship(
        "MembershipTable", 
        primaryjoin="CourseTable.id == MembershipTable.course_id",
        foreign_keys="[MembershipTable.course_id]",
        back_populates="course", 
        uselist=True, 
        cascade="all, delete-orphan"
    )
    associations = relationship(
        "AssociatedTable", 
        primaryjoin="CourseTable.id == AssociatedTable.associator_id", 
        foreign_keys="[AssociatedTable.associator_id]",
        back_populates="associator",
        uselist=True, 
        cascade="all, delete-orphan"
    )

    def to_reducer_dict(self) -> dict:
        excludes = ["password", "image"]
        data = self.to_dict(excludes)
        data['private'] = bool(self.password)
        return data

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

class AssociatedTable(db.base, db.mixin):
    __tablename__ = 'associations'

    associated_id = Column(Uuid(as_uuid=True), ForeignKey('courses.id'))
    associator_id = Column(Uuid(as_uuid=True), ForeignKey('courses.id'))
    associated = relationship("CourseTable", foreign_keys=[associated_id], uselist=False)
    associator = relationship("CourseTable", foreign_keys=[associator_id], uselist=False, back_populates="associations")

    def to_reducer_dict(self) -> dict:
        excludes = ["associated_id", "associator_id"]
        data = self.to_dict(excludes)
        data["associated"] = self.associated.to_reducer_dict()
        data["associator"] = self.associator.to_reducer_dict()
        return data

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
