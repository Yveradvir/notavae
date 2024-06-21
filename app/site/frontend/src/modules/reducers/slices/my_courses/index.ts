import { createSlice } from "@reduxjs/toolkit";
import { myCoursesInitialState } from "./const";

export const MY_COURSES_FEATURE_KEY = "my_courses";

const myCoursesSlice = createSlice({
    name: MY_COURSES_FEATURE_KEY,
    initialState: myCoursesInitialState,
    reducers: {
        reset: () => myCoursesInitialState,
    },
    extraReducers: (builder) => {
        builder
    },
});

export const myCoursesReducer = myCoursesSlice.reducer;
export const myCoursesActions = myCoursesSlice.actions;
