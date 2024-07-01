import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";
import { CourseEntity, defaultFilters, FiltersEntity } from "../const";

export interface FindCoursesState extends EntityState<CourseEntity, EntityId> {
    ids: EntityId[];
    loading: LoadingStatus;
    error: RejectedError | null;
    filters: FiltersEntity;
    hasMore: boolean;
    totalPages: number
}

export const findCoursesAdapter = createEntityAdapter<CourseEntity>();
export const findCoursesInitialState = findCoursesAdapter.getInitialState({
    ids: [],
    loading: LoadingStatus.ANotLoaded,
    error: null,
    filters: defaultFilters,
    totalPages: 1,
    hasMore: true
});
