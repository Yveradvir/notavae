from fastapi import Request, Depends, Path, HTTPException
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.database.models.user import UserTable
from app.core.database.models.courses import CourseTable
from app.core.database.models.memberships import MembershipTable

from app.core.utils.model_check import model_check_by_uuid
from app.core.utils.membership_actions import is_user_in, does_user_cross_memberships_limit, does_course_cross_memberships_limit

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest, BaseResponse, TodoModel
from app.site.backend.src.subapps.courses.models import CoursesMembershipStatusChange


membership_router = APIRouter(
    prefix="/m", 
    tags=["courses", "single_course", "memberships"]
)

@membership_router.get(path="", response_model=BaseResponse)
async def get__single_course__memberships(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    memberships = [membership.to_reducer_dict() for membership in (await db.execute(
        select(MembershipTable)
            .where(MembershipTable.course_id == instance.id)
    )).scalars().all()]

    return JSONResponse(BaseResponse(subdata=memberships).model_dump(), 200)

@membership_router.post(path="/join", response_model=BaseResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course__memberships__join(
    request: Request, body: PasswordedRequest,
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    
    await does_user_cross_memberships_limit(db, me.id)
    await does_course_cross_memberships_limit(db, instance.id)

    membership: MembershipTable = await is_user_in(db, me.id, instance.id)

    if not membership:
        if instance.password:
            if cryptcontext.verify(body.password, instance.password) == False:
                raise HTTPException(403, "Invalid credentials")
        
        new_membership = MembershipTable(
            user_id = me.id, course_id=instance.id
        )

        db.add(new_membership)

        await db.commit()
        await db.refresh(new_membership)

        return JSONResponse(
            BaseResponse(
                subdata=new_membership.course.to_reducer_dict(),
                todo=TodoModel()
            ).model_dump(), 201
        )
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

        return JSONResponse(
            OneResultedResponse(
                subdata=_id,
                todo=TodoModel(
                    my_courses_update=True
                ).model_dump()
            ), 201
        )
    else:
        raise HTTPException(404, "You aren't a member of this group")


@membership_router.delete(path="/kick/{user_id}", response_model=OneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course__memberships__leave(
    instance_id: Annotated[str, Path(...)], user_id: Annotated[str, Path(...)],
    request: Request, db: AsyncSession = Depends(db.get_session)
):
    my_id = request.state.token["data"]["id"]

    if my_id == user_id:
        raise HTTPException(409, "You can't kick yourself, leave instead")

    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    
    me: UserTable = await model_check_by_uuid(my_id, db, UserTable)
    my_membership: MembershipTable = await is_user_in(db, me.id, instance.id)

    user = await model_check_by_uuid(user_id, db, UserTable)
    user_membership: MembershipTable = await is_user_in(db, user.id, instance.id)


    if my_membership and user_membership:
        if my_membership.is_admin == False:
            raise HTTPException(403, "You aren't an admin of this group")
        _id = user_membership.id

        db.delete(user_membership)
        await db.commit()

        return JSONResponse(
            OneResultedResponse(
                subdata=_id,
                todo=TodoModel(
                    my_courses_update=True
                )
            ).model_dump(), 201
        )
    else:
        if not my_membership:
            raise HTTPException(404, "You aren't a member of this group")
        else:
            raise HTTPException(404, "Kicked user isn't a member of this group")


@membership_router.patch(path="/status", response_model=BaseResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course__memberships__leave(
    request: Request, body: CoursesMembershipStatusChange,
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    membership: MembershipTable = await is_user_in(db, me.id, instance.id)

    if membership:
        membership.status = body.status

        await db.commit()
        await db.refresh(membership)

        return JSONResponse(BaseResponse(subdata=membership.to_reducer_dict()).model_dump(), 200)
    else:
        raise HTTPException(404, "You aren't a member of this group")


@membership_router.patch(path="/active", response_model=BaseResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def single_course__memberships__leave(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    membership: MembershipTable = await is_user_in(db, me.id, instance.id)

    if membership:
        membership.is_active = not membership.is_active

        await db.commit()
        await db.refresh(membership)

        return JSONResponse(BaseResponse(subdata=membership.to_reducer_dict()).model_dump(), 200)
    else:
        raise HTTPException(404, "You aren't a member of this group")
