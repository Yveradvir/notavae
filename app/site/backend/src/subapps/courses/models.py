from app.site.backend.src.utils.models import *


class CoursesCourseNewModel(BaseModel):
    name: str
    password: str | None
    description: str

    image: str | None