from fastapi import Request, Depends, HTTPException, Query

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.utils.image_check import from_frontend
from app.core.utils.model_check import model_check_by_uuid
from app.core.utils.membership_actions import does_user_cross_memberships_limit

from app.core.database.models.user import UserTable
from app.core.database.models.courses import CourseTable, AssociatedTable
from app.core.database.models.memberships import MembershipTable

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest, FilterQuerys
from app.site.backend.src.utils.filter_the_groups import filter_the_groups
from app.site.backend.src.subapps.courses.models import CoursesCourseNewModel, BaseResponse

from app.site.backend.src.subapps.courses.single_router import single_router

router = APIRouter(
    prefix="/c", 
    tags=["courses"]
)

router.include_router(single_router)

@router.post(path="/new", response_model=OneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def courses_new(
    request: Request, body: CoursesCourseNewModel,
    db: AsyncSession = Depends(db.get_session)
):
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    await does_user_cross_memberships_limit(db, me.id)
    course: CourseTable = (await db.execute(
        select(CourseTable)
            .where(CourseTable.name == body.name)
            .options(selectinload(CourseTable.author))
    )).scalar_one_or_none()

    if not course:
        body = body.model_dump()

        password = body.pop("password")
        image = from_frontend(body.pop("image"))
        
        if password: password = cryptcontext.hash(password)
        else: password = None

        new_course = CourseTable(
            author_id=me.id, 
            password=password, 
            image=image, 
            **body
        )

        db.add(new_course)
        await db.commit()
        await db.refresh(new_course)
        
        new_membership = MembershipTable(course_id=new_course.id, user_id=me.id, is_admin=True)
        db.add(new_membership)
        await db.commit()

        return JSONResponse(OneResultedResponse(subdata=str(new_course.id)).model_dump(), 201)
    else: 
        raise HTTPException(409, "Course arleady exist.")


@router.get("/find", response_model=BaseResponse)
async def courses_find(
    request: Request, filters: FilterQuerys = Depends(),
    page: int = Query(1), user_id: str | None = Query(None),
    db: AsyncSession = Depends(db.get_session)
):
    print(filters.model_dump())
    offset = (page - 1) * settings.pagination_unit
    if user_id:
        await model_check_by_uuid(user_id, db, UserTable)
    
    courses = [course.to_reducer_dict() for course in (await db.execute(
        (await filter_the_groups(db, filters, user_id))
            .offset(offset)
            .limit(settings.pagination_unit)
    )).scalars().all()]

    return JSONResponse(BaseResponse(subdata=courses).model_dump(), 200)