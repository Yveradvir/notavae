import { TableMixin } from "@modules/constants/mixins.const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";

export interface AssociationsEntity extends TableMixin {
    associated_id: string;
    associated_name: string;
    associator_id: string;
}

export interface ccAssociationsState extends EntityState<AssociationsEntity, EntityId> {
    ids: EntityId[];
    loading: LoadingStatus;
    error: RejectedError | null;
}

export const ccAssociationsAdapter = createEntityAdapter<AssociationsEntity>();
export const ccAssociationsInitialState = ccAssociationsAdapter.getInitialState({
    ids: [],
    loading: LoadingStatus.ANotLoaded,
    error: null
});
