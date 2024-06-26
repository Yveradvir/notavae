import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findCoursesAdapter, findCoursesInitialState } from "./const";
import { FiltersEntity } from "../const";
import {
    loadFindCourses,
    loadFindCourses__Fulfilled,
    loadFindCourses__Pending,
    loadFindCourses__Rejected,
} from "./thunks/load_find_courses.thunk";

export const FIND_COURSES_FEATURE_KEY = "find_courses";

const findCoursesSlice = createSlice({
    name: FIND_COURSES_FEATURE_KEY,
    initialState: findCoursesInitialState,
    reducers: {
        reset: () => findCoursesInitialState,
        changeNewFilter: (state, action: PayloadAction<FiltersEntity>) => {
            state.filters = action.payload;
            findCoursesAdapter.removeAll(state);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFindCourses.pending, loadFindCourses__Pending)
            .addCase(loadFindCourses.fulfilled, loadFindCourses__Fulfilled)
            .addCase(loadFindCourses.rejected, loadFindCourses__Rejected);
    },
});

export const findCoursesReducer = findCoursesSlice.reducer;
export const findCoursesActions = findCoursesSlice.actions;
