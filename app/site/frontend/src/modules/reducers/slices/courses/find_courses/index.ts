import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findCoursesAdapter, findCoursesInitialState } from "./const";
import { FiltersEntity } from "../const";

export const FIND_COURSES_FEATURE_KEY = "find_courses";

const findCoursesSlice = createSlice({
    name: FIND_COURSES_FEATURE_KEY,
    initialState: findCoursesInitialState,
    reducers: {
        reset: () => findCoursesInitialState,
        changeNewFilter: (state, action: PayloadAction<FiltersEntity>) => {
            state.filters = action.payload;
            findCoursesAdapter.removeAll(state)
        }
    },
    extraReducers: (builder) => {
        builder
    },
});

export const findCoursesReducer = findCoursesSlice.reducer;
export const findCoursesActions = findCoursesSlice.actions;
