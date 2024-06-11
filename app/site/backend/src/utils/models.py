from pydantic import BaseModel

from typing import Dict, Union

class TodoModel(BaseModel): 
    """
    A model that indicates to the frontend the actions that need to be performed
    """
    pass

class BaseResponse(BaseModel):
    """
    Base model for all responses from this api.
    """
    subdata: Union[Dict, None] = {}
    todo: TodoModel = TodoModel()

__all__ = [
    "BaseModel", 
    "TodoModel", 
    "BaseResponse"
]