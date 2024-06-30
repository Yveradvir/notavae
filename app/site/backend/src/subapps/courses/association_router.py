from fastapi import Request, Depends, Path, HTTPException
from typing import Annotated

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.database.models.user import UserTable
from app.core.database.models.courses import CourseTable
from app.core.database.models.memberships import MembershipTable

from app.core.utils.model_check import model_check_by_uuid

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest, BaseResponse, TodoModel


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
    associations = [asso.to_reducer_dict() for asso in instance.associations]

    return JSONResponse(BaseResponse(subdata=associations).model_dump(), 200)