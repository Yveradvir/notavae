from fastapi import Request, Depends

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.site.backend.src.utils.const import OneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.classes.models import ClassesNewModel

router = APIRouter(
    prefix="/classes", 
    tags=["class", "classes"]
)

@router.post(path="/new", response_model=OneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def classes_new(
    request: Request, body: ClassesNewModel,
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(OneResultedResponse(subdata=None).model_dump(), 201)