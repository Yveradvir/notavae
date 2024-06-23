import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { myCoursesAdapter, myCoursesInitialState } from "./const";
import {
    loadMyCourses,
    loadMyCourses__Fulfilled,
    loadMyCourses__Pending,
    loadMyCourses__Rejected,
} from "./thunks/load_my_courses.thunk";
import {
    joinToCourse,
    joinToCourse__Fulfilled,
    joinToCourse__Pending,
    joinToCourse__Rejected,
} from "./thunks/join_to_course.thunk";
import {
    leaveCourse,
    leaveCourse__Fulfilled,
    leaveCourse__Pending,
    leaveCourse__Rejected,
} from "./thunks/leave_course.thunk";
import { FiltersEntity } from "../const";

export const MY_COURSES_FEATURE_KEY = "my_courses";

const myCoursesSlice = createSlice({
    name: MY_COURSES_FEATURE_KEY,
    initialState: myCoursesInitialState,
    reducers: {
        reset: () => myCoursesInitialState,
        changeNewFilter: (state, action: PayloadAction<FiltersEntity>) => {
            state.filters = action.payload;
            myCoursesAdapter.removeAll(state)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMyCourses.pending, loadMyCourses__Pending)
            .addCase(loadMyCourses.fulfilled, loadMyCourses__Fulfilled)
            .addCase(loadMyCourses.rejected, loadMyCourses__Rejected)

            .addCase(joinToCourse.pending, joinToCourse__Pending)
            .addCase(joinToCourse.fulfilled, joinToCourse__Fulfilled)
            .addCase(joinToCourse.rejected, joinToCourse__Rejected)

            .addCase(leaveCourse.pending, leaveCourse__Pending)
            .addCase(leaveCourse.fulfilled, leaveCourse__Fulfilled)
            .addCase(leaveCourse.rejected, leaveCourse__Rejected);
    },
});

export const myCoursesReducer = myCoursesSlice.reducer;
export const myCoursesActions = myCoursesSlice.actions;
