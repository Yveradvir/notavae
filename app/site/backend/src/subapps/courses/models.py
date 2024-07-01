from app.site.backend.src.utils.models import *


class CoursesCourseNewModel(BaseModel):
    name: str
    password: str | None
    description: str

    image: str | None


class CoursesPreDeleteModel(BaseModel):
    user_password: str
    course_password: str | None


class CoursesAssociationNewModel(BaseModel):
    name: str
    password: str | None


class CoursesSingleTopicChange(BaseModel):
    current_topic: str
    course_password: str | None

    
class CoursesMembershipStatusChange(BaseModel):
    status: str