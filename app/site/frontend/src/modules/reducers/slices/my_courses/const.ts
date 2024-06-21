import { TableMixin } from "@modules/constants/mixins.const";
import { LoadingStatus } from "@modules/constants/reducers.conts"
import { RejectedError } from "@modules/constants/rejector.const";
import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";

export interface MyCourseEntity extends TableMixin {
    name: string;
    description: string;
    author_id: string;
}

export interface MyCoursesState extends EntityState<MyCourseEntity, EntityId> {
    ids: EntityId[];
    loading: LoadingStatus;
    error:  RejectedError | null;
}

export const myCoursesAdapter = createEntityAdapter<MyCourseEntity>();
export const myCoursesInitialState = myCoursesAdapter.getInitialState({
    loading: LoadingStatus.ANotLoaded,
    error: null
})