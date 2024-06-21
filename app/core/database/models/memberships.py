from app.core.database import db
from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Uuid

class MembershipTable(db.base, db.mixin):
    __tablename__ = 'memberships'

    course_id = Column(Uuid(as_uuid=True), ForeignKey('courses.id'))
    user_id = Column(Uuid(as_uuid=True), ForeignKey('users.id'))

    course = relationship("CourseTable", foreign_keys=[course_id], uselist=False)
    user = relationship("UserTable", foreign_keys=[user_id], uselist=False)

    def to_reducer_dict(self) -> dict:
        excludes = ["course_id", "user_id"]

        data = self.to_dict(excludes)
        
        data["course"] = self.course.to_reducer_dict()
        data["user"] = self.user.to_reducer_dict()
        
        return data

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
