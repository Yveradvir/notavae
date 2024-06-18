from fastapi import Request, Depends, HTTPException

from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter

from app.core.const import *
from app.core.database.models.user import UserTable

from app.site.backend.src.utils.const import NoneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.auth.models import ASignUpRequest, ASingInRequest 


router = APIRouter(
    prefix="/a", 
    tags=["auth"]
)

@router.post(path="/signup", response_model=NoneResultedResponse)
async def a_signup(
    request: Request, body: ASignUpRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    querys = [select(UserTable).where(UserTable.username == body.username), select(UserTable).where(UserTable.email == body.email)]
    queryset = [(await db.execute(query)).scalar_one_or_none() for query in querys]

    if not queryset[0]:
        if not queryset[1]:
            body = body.model_dump()
            image = b64decode(body.pop("image").encode())

            user = UserTable(image=image, **body)
            
            db.add(user)
            await db.commit()

            id = str(user.id)
            response = JSONResponse(NoneResultedResponse().model_dump(), 200)

            jwtsecure.set_cookies(response, jwtsecure.create_access_token({"id": id}), "access")
            jwtsecure.set_cookies(response, jwtsecure.create_refresh_token({"id": id}), "refresh")

            return response
        else:
            raise HTTPException(409, "Email has taken.")
    else:
        raise HTTPException(409, "User arleady exist.")

@router.post(path="/signin", response_model=NoneResultedResponse)
async def a_signin(
    request: Request, body: ASingInRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

@router.post(path="/signout", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def a_signout(
    request: Request, body: PasswordedRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

@router.post(path="/refresh", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_refresh_token)])
async def a_refresh(
    request: Request, db: AsyncSession = Depends(db.get_session)
):
    return JSONResponse(NoneResultedResponse().model_dump(), 200)

