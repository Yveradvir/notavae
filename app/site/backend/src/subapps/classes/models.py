from app.site.backend.src.utils.models import *


class ClassesNewModel(BaseModel):
    name: str
    description: str
    password: str
    image: str