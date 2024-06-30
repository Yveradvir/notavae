from fastapi import Request, Depends, Path, HTTPException
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.database.models.courses import CourseTable
from app.core.database.models.user import UserTable

from app.core.utils.model_check import model_check_by_uuid

from app.site.backend.src.utils.const import BaseResponse, NoneResultedResponse
from app.site.backend.src.subapps.courses.models import CoursesPreDeleteModel

from app.site.backend.src.subapps.courses.memberships_router import membership_router
from app.site.backend.src.subapps.courses.association_router import association_router

single_router = APIRouter(
    prefix="/single/{instance_id}", 
    tags=["courses", "single_course"]
)


@single_router.get(path="", response_model=BaseResponse)
async def get__single_course(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    return JSONResponse(BaseResponse(subdata=instance.to_reducer_dict()).model_dump(), 200)


@single_router.post(path="/predelete", dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course_predelete(
    request: Request, instance_id: Annotated[str, Path(...)],
    body: CoursesPreDeleteModel,
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    me: UserTable = await model_check_by_uuid(request.state.token['data']['id'], db, UserTable)

    if not cryptcontext.verify(body.user_password, me.password):
        raise HTTPException(403, "Provided user password doesn't match with your")

    if instance.password:
        if not cryptcontext.verify(body.course_password, instance.password):
            raise HTTPException(403, "Provided course doesn't match with real password")
    
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

@single_router.delete(path="", dependencies=[Depends(jwtsecure.depend_access_token)])
async def delete__single_course(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    return None

single_router.include_router(membership_router)
single_router.include_router(association_router)