from pydantic import BaseModel

class CoreSettings(BaseModel):
    max_memberships_per_user: int
    max_asso_per_course: int
    max_memberships_per_course: int
    pagination_unit: int # it means how many elements per one page
