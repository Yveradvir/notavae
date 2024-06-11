from app.core.const import getenv
from app.core.database import db

from contextlib import asynccontextmanager
from typing import AsyncContextManager, Callable, AsyncGenerator, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.site.backend.src.subapps import auth

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[Any, None]:
    db.init(getenv("DB_URL"))
    yield

def set_routers(app: FastAPI) -> None:
    app.include_router(auth.router)

def makeapp(
    lifespan: AsyncContextManager,
    set_routers: Callable[[FastAPI], None]
) -> FastAPI:
    app = FastAPI(
        debug=True, lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware, allow_credentials = True,
        allow_origins = [
            "http://localhost:4200"
        ],
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    )

    set_routers(app)

    return app
