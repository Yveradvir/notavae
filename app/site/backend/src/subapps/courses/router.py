from fastapi import Request, Depends, HTTPException

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *

from app.core.utils.image_check import from_frontend
from app.core.utils.model_check import model_check_by_uuid

from app.core.database.models.user import UserTable
from app.core.database.models.courses import CourseTable, AssociatedTable

from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.courses.models import CoursesCourseNewModel

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
        
        return JSONResponse(OneResultedResponse(subdata=str(new_course.id)).model_dump(), 201)
    else: 
        raise HTTPException(409, "Course arleady exist.")
