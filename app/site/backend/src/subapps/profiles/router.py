from fastapi import Request, Depends

from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest

from app.site.backend.src.subapps.profiles.single_router import single_router

router = APIRouter(
    prefix="/p", 
    tags=["profiles"]
)

router.include_router(single_router)

@router.get(path="/my", dependencies=[Depends(jwtsecure.depend_access_token)])
async def profiles_my(
    request: Request
):
    return RedirectResponse(url=f"/p/single/{request.state.token["data"]["id"]}", status_code=307)