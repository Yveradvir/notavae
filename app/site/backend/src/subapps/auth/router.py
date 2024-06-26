from datetime import datetime

from fastapi import Request, Depends, HTTPException, APIRouter
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from app.core.const import *
from app.core.utils.model_check import model_check_by_uuid
from app.core.utils.image_check import from_frontend
from app.core.database.models.user import UserTable, BadTokenTable
from app.site.backend.src.utils.const import NoneResultedResponse, PasswordedRequest
from app.site.backend.src.subapps.auth.models import ASignUpRequest, ASingInRequest, AChangePasswordRequest, TodoModel

router = APIRouter(prefix="/a", tags=["auth"])


@router.post("/signup", response_model=NoneResultedResponse)
async def a_signup(
    request: Request, body: ASignUpRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    user_query = await db.execute(
        select(UserTable)
            .where(
                (UserTable.username == body.username) 
                |     (UserTable.email == body.email)
            )
            .options(selectinload(UserTable.badtokens))
    )
    user = user_query.scalar_one_or_none()

    if user:
        if user.username == body.username:
            raise HTTPException(status_code=409, detail="Username is already taken.")
        if user.email == body.email:
            raise HTTPException(status_code=409, detail="Email is already taken.")

    body_dict = body.model_dump()

    image = from_frontend(body_dict.pop("image"))
    birth = datetime.strptime(body_dict.pop("birth"), "%Y-%m-%dT%H:%M:%S.%fZ")
    
    password = cryptcontext.hash(body_dict.pop("password"))

    new_user = UserTable(image=image, birth=birth, password=password, **body_dict)
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    response = JSONResponse(content=NoneResultedResponse(
        todo=TodoModel(
            user_profile_update=True
        )
    ).model_dump(), status_code=201)
    
    jwtsecure.set_cookies(response, jwtsecure.create_access_token({"id": str(new_user.id)}), "access")
    jwtsecure.set_cookies(response, jwtsecure.create_refresh_token({"id": str(new_user.id)}), "refresh")
    
    return response


@router.post("/signin", response_model=NoneResultedResponse)
async def a_signin(
    body: ASingInRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    try:
        user_query = await db.execute(
            select(UserTable).where(UserTable.username == body.username)
        )
        user = user_query.scalar_one()
        if cryptcontext.verify(body.password, user.password):
            response = JSONResponse(content=NoneResultedResponse(
                todo=TodoModel(
                    user_profile_update=True
                )
            ).model_dump(), status_code=200)
            
            jwtsecure.set_cookies(response, jwtsecure.create_access_token({"id": str(user.id)}), "access")
            jwtsecure.set_cookies(response, jwtsecure.create_refresh_token({"id": str(user.id)}), "refresh")
            
            return response
        else:
            raise HTTPException(status_code=403, detail="Invalid credentials.")
    except NoResultFound:
        raise HTTPException(status_code=404, detail="User not found.")


@router.post("/signout", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def a_signout(
    request: Request, body: PasswordedRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)

    if cryptcontext.verify(body.password, me.password):
        block = [
            BadTokenTable(uid=me.id, jti=request.cookies.get(cookie_names.access_token_cookie).split(".")[1], ttype="access"), 
            BadTokenTable(uid=me.id, jti=request.cookies.get(cookie_names.refresh_token_cookie).split(".")[1], ttype="refresh")
        ]

        db.add_all(block)
        await db.commit()

        response = JSONResponse(content=NoneResultedResponse(
            todo=TodoModel(
                user_profile_unset=True
            )
        ).model_dump(), status_code=200)
        jwtsecure.unset_cookies(response)

        return response
    else:
        raise HTTPException(status_code=403, detail="Invalid credentials.")

@router.post("/refresh", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_refresh_token)])
async def a_refresh(
    request: Request
):
    response = JSONResponse(content=NoneResultedResponse().model_dump(), status_code=200)

    jwtsecure.set_cookies(response, jwtsecure.create_access_token({"id": str(request.state.token["data"]["id"])}), "access")
    
    return response

@router.patch("/password_change", response_model=NoneResultedResponse, dependencies=[Depends(jwtsecure.depend_access_token)])
async def a_password_change(
    request: Request, body: AChangePasswordRequest, 
    db: AsyncSession = Depends(db.get_session)
):
    me: UserTable = await model_check_by_uuid(request.state.token["data"]["id"], db, UserTable)
    
    if cryptcontext.verify(body.password, me.password):
        me.password = cryptcontext.hash(body.new_password)
        await db.commit()

        return JSONResponse(content=NoneResultedResponse().model_dump(), status_code=200)
    else:
        raise HTTPException(status_code=403, detail="Invalid credentials.")