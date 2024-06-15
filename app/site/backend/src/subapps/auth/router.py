from fastapi import Request, Depends

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.site.backend.src.utils.const import NoneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.auth.models import ASignUpRequest, ASingInRequest 


router = APIRouter(
    prefix="/a", 
    tags=["auth"]
)

@router.post(path="/signup", response_model=NoneResultedResponse)
async def a_signup(
    request: Request, body: ASignUpRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 201)

@router.post(path="/signin", response_model=NoneResultedResponse)
async def a_signin(
    request: Request, body: ASingInRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

@router.post(path="/signout", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def a_signout(
    request: Request, body: PasswordedRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

@router.post(path="/refresh", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_refresh_token)])
async def a_refresh(
    request: Request, db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

