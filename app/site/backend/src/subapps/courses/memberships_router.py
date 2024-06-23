from fastapi import Request, Depends, Path, HTTPException
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.database.models.user import UserTable
from app.core.database.models.courses import CourseTable
from app.core.database.models.memberships import MembershipTable

from app.core.utils.model_check import model_check_by_uuid
from app.core.utils.membership_actions import is_user_in

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest, BaseResponse
from app.site.backend.src.subapps.courses.models import CoursesCourseNewModel


membership_router = APIRouter(
    prefix="/m", 
    tags=["courses", "single_course", "memberships"]
)


@membership_router.post(path="/join", response_model=BaseResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course__memberships__join(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    membership: MembershipTable = await is_user_in(db, me.id, instance.id)

    if not membership:
        new_membership = MembershipTable(
            user_id = me.id, course_id=instance.id
        )

        db.add(new_membership)

        await db.commit()
        await db.refresh(new_membership)

        return JSONResponse(BaseResponse(subdata=new_membership.course.to_reducer_dict()), 201)
    else:
        raise HTTPException(409, "You are arleady a member of this group")


@membership_router.delete(path="/leave", response_model=OneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course__memberships__leave(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    membership: MembershipTable = await is_user_in(db, me.id, instance.id)

    if membership:
        _id = str(membership.id)
        db.delete(membership)
        
        await db.commit()

        return JSONResponse(OneResultedResponse(subdata=_id), 201)
    else:
        raise HTTPException(409, "You are arleady a member of this group")