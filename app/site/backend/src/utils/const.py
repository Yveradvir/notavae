from app.site.backend.src.utils.models import *
from typing import Any, Union

class PasswordedRequest(BaseModel):
    """
    For routes that require a password to continue.
    """
    
    password: str

class NoneResultedResponse(BaseModel):
    """
    For routes that return response but data.
    """

    response_type: ResponseModelTypes = ResponseModelTypes.noneresulted
    todo: TodoModel = TodoModel()

class OneResultedResponse(BaseResponse):
    """
    For routes that return a single value in subdata.
    """
    
    subdata: Union[Any, None] = None

    