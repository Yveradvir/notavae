import { EntityId } from "@reduxjs/toolkit"

export interface TableMixin {
    id: EntityId | string;
    created_at: string;
    updated_at: string;
}
