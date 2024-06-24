from pydantic import BaseModel

class CoreSettings(BaseModel):
    max_memberships_per_user: int
    pagination_unit: int # it means how many elements per one page
