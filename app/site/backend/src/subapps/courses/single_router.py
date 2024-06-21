from fastapi import Request, Depends, Path
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.core.database.models.courses import CourseTable

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest, BaseResponse
from app.core.utils.model_check import model_check_by_uuid
from app.site.backend.src.subapps.courses.models import CoursesCourseNewModel


single_router = APIRouter(
    prefix="/single/{instance_id}", 
    tags=["courses", "single_course"]
)


@single_router.get(path="")
async def get__single_course(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    return JSONResponse(BaseResponse(subdata=[i.to_dict() for i in instance.memberships]).model_dump(), 200)

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