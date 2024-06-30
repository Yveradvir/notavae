from app.site.backend.src.utils.models import *

from typing import Any, Union, Optional, Annotated
from fastapi import Query, Depends

class FilterQuerys(BaseModel):
    """
    For routes that require filter params in query
    """
    name: Optional[str] = Query(None)
    newest: bool = Query(True)
    am_i_author: int = Query(1)
        # 0 - I am author
        # 1 - All groups
        # 2 - I am NOT author

class PasswordedRequest(BaseModel):
    """
    For routes that require a password to continue.
    """
    
    password: Union[str, None]

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