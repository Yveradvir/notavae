from fastapi import Request, Depends

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.classes.models import ClassesNewModel

from app.site.backend.src.subapps.classes.single_router import single_router

router = APIRouter(
    prefix="/c", 
    tags=["classes"]
)

router.include_router(single_router)

@router.post(path="/new", response_model=OneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def classes_new(
    request: Request, body: ClassesNewModel,
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(OneResultedResponse(subdata=None).model_dump(), 201)