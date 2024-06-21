from typing import Type, Optional
from uuid import UUID

from fastapi import HTTPException

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import DeclarativeMeta

async def model_check_by_uuid(
    uuid: str, db: AsyncSession, 
    table: Type[DeclarativeMeta]
):
    """
    Function to check if object id exists.

    Parameters:
        uuid (str): string that may be uuid instance.
        db (AsyncSession): instance of current session.
        table (Type[DeclarativeMeta]): Table class.
    Return: scalar or none.
    Raises:
        400 - If uuid was not similar to uuid.
        404 - If object was not found.
    """
    try:
        uuid = UUID(uuid)
    except ValueError:
        raise HTTPException(
            400, "Invalid uuid was provided."
        )
    
    scalar: table = (await db.execute(
        select(table)
            .where(table.id == uuid)
    )).scalar_one_or_none()

    if not scalar:
        raise HTTPException(404, "Object was not found.")

    return scalar