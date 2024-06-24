from app.core.const import settings

from app.core.database.database_constant import AsyncSession, select
from app.core.database.models.memberships import MembershipTable

from fastapi import HTTPException
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

async def does_user_cross_memberships_limit(
    db: AsyncSession, user_id: str
) -> bool:
    """Function to check does user cross the limit of memberships"""
    query = (await db.execute(
        select(MembershipTable)
            .where(MembershipTable.user_id == user_id)
    )).scalars().all()

    if len(query) >= settings.max_memberships_per_user:
        raise HTTPException(409, f"You cannot be a member more than {settings.max_memberships_per_user} groups (Including your own)")