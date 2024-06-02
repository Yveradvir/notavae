from app.site.backend.src.app import makeapp, lifespan, set_routers

app = makeapp(
    lifespan=lifespan, 
    set_routers=set_routers
)