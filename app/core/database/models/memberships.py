from sqlalchemy import Column, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.core.database.database_constant import Base, InitialMixin

class MembershipTable(Base, InitialMixin):
    __tablename__ = 'memberships'

    course_id = Column(Uuid(as_uuid=True), ForeignKey('courses.id'))
    user_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))

    course = relationship(
        "CourseTable", foreign_keys=[course_id], 
        uselist=False, back_populates="memberships"
    )
    user = relationship(
        "UserTable", foreign_keys=[user_id], 
        uselist=False, back_populates="memberships"
    )

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
