from fastapi import Request, Depends

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest

from app.site.backend.src.subapps.profiles.single_router import single_router

router = APIRouter(
    prefix="/p", 
    tags=["profiles"]
)

router.include_router(single_router)

