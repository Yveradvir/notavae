from fastapi import Request, Depends, Path, HTTPException
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.database.models.user import UserTable
from app.core.database.models.courses import CourseTable, AssociatedTable
from app.core.database.models.memberships import MembershipTable

from app.core.utils.model_check import model_check_by_uuid

from app.site.backend.src.utils.const import OneResultedResponse, BaseResponse, TodoModel
from app.site.backend.src.subapps.courses.models import CoursesAssociationNewModel


association_router = APIRouter(
    prefix="/asso", 
    tags=["courses", "single_course", "associations"]
)


@association_router.get("", response_model=BaseResponse)
async def get__single_router__association(
    request: Request, instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
): 
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)
    associations = [asso.to_reducer_dict() for asso in (await db.execute(
        select(AssociatedTable)
            .where(AssociatedTable.associator_id == instance.id)
            .options(selectinload("*"))
    )).scalars().all()]    

    return JSONResponse(BaseResponse(subdata=associations).model_dump(), 200)


@association_router.post("", response_model=BaseResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def post__single_router__association(
    request: Request, body: CoursesAssociationNewModel,
    instance_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    instance: CourseTable = await model_check_by_uuid(instance_id, db, CourseTable)

    if instance.password:
        if not cryptcontext.verify(body.password, instance.password):
            raise HTTPException(403, "Invalid credentials")

    associated = (await db.execute(
        select(CourseTable)
            .where(CourseTable.name == body.name)
    )).scalar_one_or_none()

    if not associated:
        raise HTTPException(404, "Associated group isn't found")
    q = (
        select(AssociatedTable)
            .where(AssociatedTable.associator_id == instance.id)
    )

    if len((await db.execute(q)).scalars().all()) >= settings.max_asso_per_course:
        raise HTTPException(400, "Your course can't have more than 5 associations")

    association = (await db.execute(
        q.where(AssociatedTable.associated_id == associated.id)
    )).scalar_one_or_none()

    if association:
        raise HTTPException(409, "Association arleady exists")

    asso = AssociatedTable(
        associator_id=instance.id,
        associated_id=associated.id
    )

    db.add(asso)
    await db.commit()

    await db.refresh(asso)

    return JSONResponse(BaseResponse(subdata=asso.to_reducer_dict()).model_dump(), 201)

@association_router.delete("/{associated_id}", response_model=OneResultedResponse)
async def delete__single_router__association(
    request: Request, instance_id: Annotated[str, Path(...)],
    associated_id: Annotated[str, Path(...)],
    db: AsyncSession = Depends(db.get_session)
):
    await model_check_by_uuid(instance_id, db, CourseTable)
    associated: CourseTable = await model_check_by_uuid(associated_id, db, CourseTable)

    _id = str(associated.id)

    await db.delete(associated)
    await db.delete()

    return JSONResponse(OneResultedResponse(subdate=_id).model_dump(), 200)

