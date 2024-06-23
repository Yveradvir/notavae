import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";
import { CourseEntity, defaultFilters, FiltersEntity } from "../const";

export interface MyCoursesState extends EntityState<CourseEntity, EntityId> {
    ids: EntityId[];
    loading: LoadingStatus;
    error: RejectedError | null;
    filters: FiltersEntity;
}

export const myCoursesAdapter = createEntityAdapter<CourseEntity>();
export const myCoursesInitialState = myCoursesAdapter.getInitialState({
    ids: [],
    loading: LoadingStatus.ANotLoaded,
    error: null,
    filters: defaultFilters
});
