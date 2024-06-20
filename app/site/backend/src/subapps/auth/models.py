from app.site.backend.src.utils.models import *


class ASignUpRequest(BaseModel):
    username: str
    password: str
    email: str
    birth: str
    image: str

class ASingInRequest(BaseModel):
    username: str
    password: str

class AChangePasswordRequest(BaseModel):
    password: str
    new_password: str