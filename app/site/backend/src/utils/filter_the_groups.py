from app.site.backend.src.utils.const import FilterQuerys

from app.core.database.database_constant import select, AsyncSession
from app.core.database.models.memberships import MembershipTable
from app.core.database.models.courses import CourseTable


async def filter_the_groups(
    db: AsyncSession, filters: FilterQuerys,
    user_id: str | None = None
):
    query = select(CourseTable)
    print(filters.model_dump())
    if filters.name: query = query.where(CourseTable.name.ilike(filters.name))

    if filters.newest: query = query.order_by(CourseTable.created_at.desc())
    else: query = query.order_by(CourseTable.created_at.asc())

    if filters.am_i_author != 1:
        authorship_ids = {membership.course_id for membership in (await db.execute(
            select(MembershipTable)
                .where(MembershipTable.user_id == user_id)
                .where(MembershipTable.is_admin == True)
        )).scalars().all()}

        
        query = query.where(
            CourseTable.id.in_(authorship_ids)
            if filters.am_i_author == 0 else
            CourseTable.id.not_in(authorship_ids)
        )
        
    return query