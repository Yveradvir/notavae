from fastapi import Request, Depends

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.site.backend.src.utils.const import NoneResultedResponse
from app.site.backend.src.subapps.auth.models import ASignUpRequest


router = APIRouter(
    prefix="/a", 
    tags=["auth"]
)

@router.post(path="/signup", response_model=NoneResultedResponse)
async def a_signup(
    request: Request, body: ASignUpRequest
):
    return NoneResultedResponse()