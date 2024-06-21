from fastapi import Request, Depends, Path
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.courses.models import CoursesCourseNewModel


single_router = APIRouter(
    prefix="/single/{instance_id}", 
    tags=["courses", "single_course"]
)


@single_router.get(path="")
async def get__single_course(
    request: Request, db: AsyncSession = Depends(db.get_session)
):
    return None

@single_router.patch(path="", dependencies=[Depends(jwtsecure.depend_access_token)])
async def patch__single_course(
    request: Request, body: CoursesCourseNewModel,
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    return None

@single_router.delete(path="", dependencies=[Depends(jwtsecure.depend_access_token)])
async def delete__single_course(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    return None