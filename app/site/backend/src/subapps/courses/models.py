from app.site.backend.src.utils.models import *


class CoursesCourseNewModel(BaseModel):
    name: str
    password: str | None
    description: str

    image: str | None

class CoursesPreDeleteModel(BaseModel):
    user_password: str
    course_password: str

class CoursesMembershipStatusChange(BaseModel):
    status: str