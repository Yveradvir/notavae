from pydantic import BaseModel

from typing import Dict, Union
from enum import Enum, auto

class ResponseModelTypes(Enum):
    default = auto()
    noneresulted = auto()

class TodoModel(BaseModel): 
    """
    A model that indicates to the frontend the actions that need to be performed
    """
    user_profile_update: bool = False

class BaseResponse(BaseModel):
    """
    Base model for all responses from this api.
    """
    response_type: ResponseModelTypes = ResponseModelTypes.default.value
    subdata: Union[Dict, None] = {}
    todo: TodoModel = TodoModel()


__all__ = [
    "BaseModel", 
    "TodoModel", 
    "BaseResponse",
    "ResponseModelTypes"
]