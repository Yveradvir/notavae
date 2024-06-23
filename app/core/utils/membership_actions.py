from app.core.database.database_constant import AsyncSession, select
from app.core.database.models.memberships import MembershipTable

from typing import Type
from sqlalchemy.orm import DeclarativeMeta

async def is_user_in(
    db: AsyncSession, 
    user_id: str, course_id: str
) -> Type[DeclarativeMeta] | None:
    """Function that check if is user in group and returne instance if so."""
    
    instance = (await db.execute(
        select(MembershipTable)
            .where(MembershipTable.user_id == user_id)
            .where(MembershipTable.course_id == course_id)
    )).scalar_one_or_none()
    
    return instance