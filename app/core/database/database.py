from typing import Union
from app.core.database.database_constant import *

from app.core.database.models.user import UserTable, BadTokenTable
from app.core.database.models.courses import CourseTable, AssociatedTable
from app.core.database.models.memberships import MembershipTable


class Database:
    engine: Union[AsyncEngine, None] = None
    session_maker: Union[async_sessionmaker, None] = None

    def __init__(self) -> None:
        self.base = Base

    def init(self, url: str):
        """
        Function to initialize database connection.

        Parameters:
            url (str): connection string
        """
        self.engine = create_async_engine(url)
        self.session_maker = async_sessionmaker(self.engine, expire_on_commit=False)
        configure_mappers()

    async def init_models(self):
        """
        Function to create all models.
        """
        async with self.engine.begin() as conn:
            await conn.run_sync(self.base.metadata.create_all)

    async def get_session(self) -> AsyncSession: # type: ignore
        """
        Get a new async session.
        """
        async with self.session_maker() as session:
            yield session

db = Database()