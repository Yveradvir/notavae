from fastapi import Request, Depends

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

router = APIRouter(prefix="/a", tags=["auth"], dependencies=[Depends(jwtsecure.depend_access_token)])

@router.post(path="/signup")
async def a_signup(request: Request):
    return JSONResponse({
        "h": "hello"
    })