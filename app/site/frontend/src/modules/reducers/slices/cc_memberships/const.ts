import { TableMixin } from "@modules/constants/mixins.const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";

export interface MembershipEntity extends TableMixin {
    is_active: boolean;
    is_admin: boolean;
    status: string;
    course_id: string;
    user_id: string;
}

export interface ccMembershipsState extends EntityState<MembershipEntity, EntityId> {
    ids: EntityId[];
    loading: LoadingStatus;
    error: RejectedError | null;
}

export const ccMembershipsAdapter = createEntityAdapter<MembershipEntity>();
export const ccMembershipsInitialState = ccMembershipsAdapter.getInitialState({
    ids: [],
    loading: LoadingStatus.ANotLoaded,
    error: null
});
