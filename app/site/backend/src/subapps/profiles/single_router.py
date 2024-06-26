from fastapi import Request, Depends, Path, HTTPException
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.core.utils.model_check import model_check_by_uuid
from app.core.utils.image_check import to_frontend

from app.core.database.models.user import UserTable 
from app.core.database.models.courses import CourseTable 
from app.core.database.models.memberships import MembershipTable 

from app.site.backend.src.utils.const import NoneResultedResponse, PasswordedRequest, BaseResponse, OneResultedResponse,FilterQuerys
from app.site.backend.src.utils.filter_the_groups import filter_the_groups


single_router = APIRouter(
    prefix="/single/{instance_id}", 
    tags=["profiles", "single_profile"]
)


@single_router.get(path="")
async def get__single_profile(
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: UserTable = await model_check_by_uuid(instance_id, db, UserTable)

    return JSONResponse(BaseResponse(subdata=instance.to_reducer_dict()).model_dump(), 200)

@single_router.delete(path="", response_model=NoneResultedResponse)
async def delete__single_profile(
    body: PasswordedRequest,
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: UserTable = await model_check_by_uuid(instance_id, db, UserTable)

    if cryptcontext.verify(body.password, instance.password):
        return JSONResponse(NoneResultedResponse().model_dump(), 200)
    else:
        raise HTTPException(403, "Passwords do not match.")

@single_router.get(path="/image", response_model=OneResultedResponse)
async def get__single_profile(
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: UserTable = await model_check_by_uuid(instance_id, db, UserTable)

    return JSONResponse(OneResultedResponse(subdata=to_frontend(instance.image)).model_dump(), 200)


@single_router.post(path="/password", response_model=NoneResultedResponse)
async def check_single_profile_password(
    request: Request, body: PasswordedRequest,
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: UserTable = await model_check_by_uuid(instance_id, db, UserTable)

    if cryptcontext.verify(body.password, instance.password):
        return JSONResponse(NoneResultedResponse().model_dump(), 200)
    else:
        raise HTTPException(403, "Passwords do not match.")
    
@single_router.get("/courses", response_model=BaseResponse, tags=["courses"])
async def single_profile_courses(
    request: Request, instance_id: Annotated[str, Path(...)],
    filters: FilterQuerys = Depends(), db: AsyncSession = Depends(db.get_session)
):
    instance: UserTable = await model_check_by_uuid(instance_id, db, UserTable)
    query = await filter_the_groups(db, filters, instance.id)
    membership_ids = {membership.course_id for membership in (await db.execute(
        select(MembershipTable).where(MembershipTable.user_id == instance.id)
    )).scalars().all()}

    courses = [course.to_reducer_dict() for course in (await db.execute(
        query.where(CourseTable.id.in_(membership_ids))
    )).scalars().all()]

    return JSONResponse(BaseResponse(subdata=courses).model_dump(), 200)