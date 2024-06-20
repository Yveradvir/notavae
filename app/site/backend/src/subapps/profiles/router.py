from fastapi import Request, Depends, Query

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
    request: Request, act: int = Query(0)
):
    url = f"/p/single/{request.state.token["data"]["id"]}"
    
    if act == 0:
        return RedirectResponse(url, status_code=307)
    elif act == 1:
        return RedirectResponse(f"{url}/image", status_code=307)
    else:
        return JSONResponse(status_code=400, content={"message": "Invalid 'act' value"})
