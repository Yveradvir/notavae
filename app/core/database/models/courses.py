from sqlalchemy import Column, String, Text, Uuid, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database.database_constant import Base, InitialMixin

class CourseTable(Base, InitialMixin):
    __tablename__ = 'courses'
    
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    password = Column(String, nullable=True)
    image = Column(LargeBinary, nullable=True)
    author_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))
    
    author = relationship("UserTable")
    memberships = relationship(
        "MembershipTable", primaryjoin="CourseTable.id == MembershipTable.course_id", 
        foreign_keys="[MembershipTable.course_id]", back_populates="course", 
        uselist=True, cascade="all, delete-orphan"
    )
    associations = relationship(
        "AssociatedTable", primaryjoin="CourseTable.id == AssociatedTable.associator_id", 
        foreign_keys="[AssociatedTable.associator_id]", back_populates="associator", 
        uselist=True, cascade="all, delete-orphan"
    )

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)


class AssociatedTable(Base, InitialMixin):
    __tablename__ = 'associations'

    associated_id = Column(Uuid(as_uuid=True), ForeignKey('courses.id'))
    associator_id = Column(Uuid(as_uuid=True), ForeignKey('courses.id'))
    
    associated = relationship("CourseTable", foreign_keys=[associated_id], uselist=False)
    associator = relationship("CourseTable", foreign_keys=[associator_id], uselist=False, back_populates="associations")

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
