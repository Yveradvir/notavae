from base64 import b64decode
from datetime import datetime

from fastapi import Request, Depends, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from app.core.const import db, cryptcontext, jwtsecure
from app.core.database.models.user import UserTable
from app.site.backend.src.utils.const import NoneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.auth.models import ASignUpRequest, ASingInRequest

router = APIRouter(prefix="/a", tags=["auth"])

@router.post("/signup", response_model=NoneResultedResponse)
async def a_signup(request: Request, body: ASignUpRequest, db: AsyncSession = Depends(db.get_session)):
    user_query = await db.execute(
        select(UserTable).where((UserTable.username == body.username) | (UserTable.email == body.email)).options(selectinload(UserTable.badtokens))
    )
    user = user_query.scalar_one_or_none()

    if user:
        if user.username == body.username:
            raise HTTPException(status_code=409, detail="Username is already taken.")
        if user.email == body.email:
            raise HTTPException(status_code=409, detail="Email is already taken.")

    body_dict = body.model_dump()

    image = body_dict.pop("image")
    image = b64decode(image.encode()) if image else None
    birth = datetime.strptime(body_dict.pop("birth"), "%Y-%m-%dT%H:%M:%S.%fZ")
    
    password = cryptcontext.hash(body_dict.pop("password"))

    new_user = UserTable(image=image, birth=birth, password=password, **body_dict)
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    response = JSONResponse(content=NoneResultedResponse().model_dump(), status_code=201)
    
    jwtsecure.set_cookies(response, jwtsecure.create_access_token({"id": str(new_user.id)}), "access")
    jwtsecure.set_cookies(response, jwtsecure.create_refresh_token({"id": str(new_user.id)}), "refresh")
    
    return response

@router.post("/signin", response_model=NoneResultedResponse)
async def a_signin(request: Request, body: ASingInRequest, db: AsyncSession = Depends(db.get_session)):
    try:
        user_query = await db.execute(
            select(UserTable).where(UserTable.username == body.username)
        )
        user = user_query.scalar_one()
        if cryptcontext.verify(body.password, user.password):
            response = JSONResponse(content=NoneResultedResponse().model_dump(), status_code=200)
            
            jwtsecure.set_cookies(response, jwtsecure.create_access_token({"id": str(user.id)}), "access")
            jwtsecure.set_cookies(response, jwtsecure.create_refresh_token({"id": str(user.id)}), "refresh")
            
            return response
        else:
            raise HTTPException(status_code=403, detail="Invalid credentials.")
    except NoResultFound:
        raise HTTPException(status_code=404, detail="User not found.")

@router.post("/signout", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def a_signout(request: Request, body: PasswordedRequest, db: AsyncSession = Depends(db.get_session)):
    return JSONResponse(content=NoneResultedResponse().model_dump(), status_code=200)

@router.post("/refresh", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_refresh_token)])
async def a_refresh(request: Request, db: AsyncSession = Depends(db.get_session)):
    return JSONResponse(content=NoneResultedResponse().model_dump(), status_code=200)
