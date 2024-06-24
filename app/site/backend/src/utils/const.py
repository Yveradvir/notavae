from app.site.backend.src.utils.models import *

from typing import Any, Union, Annotated
from fastapi import Query

class FilterQuerys(BaseModel):
    """
    For routes that require a filter params in query
    """

    name: Annotated[str, Query(None)]
    newest: Annotated[bool, Query(True)]
    am_i_author: Annotated[bool, Query(False)]

class PasswordedRequest(BaseModel):
    """
    For routes that require a password to continue.
    """
    
    password: str

class NoneResultedResponse(BaseModel):
    """
    For routes that return response but data.
    """

    response_type: ResponseModelTypes = ResponseModelTypes.noneresulted.value
    todo: TodoModel = TodoModel()

class OneResultedResponse(BaseResponse):
    """
    For routes that return a single value in subdata.
    """
    
    subdata: Union[Any, None] = None