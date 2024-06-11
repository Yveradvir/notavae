from typing import Union
from app.core.database.models.database_constant import *


class Database:
    engine: Union[AsyncEngine, None]
    session: Union[AsyncSession, None]
    base: Union[DeclarativeBase, None]

    def __init__(self) -> None:
        self.mixin = InitialMixin
        self.base = Base
    
    def init(self, url: str):
        """
        Function to initialize database in lifespans and etc

        Parameters:
            url (str): connection string
        """

        self.engine = create_async_engine(url)
        self.session = async_sessionmaker(self.engine)
        
    async def init_models(self):
        """
        Function to create all models
        """
        async with self.engine.begin() as conn:
            # await conn.run_sync(self.base.metadata.drop_all)
            await conn.run_sync(self.base.metadata.create_all)

    async def get_session(self):
        """
        Database dependency for fastapi
        """
        async with self.session() as session:
            yield session

db = Database()