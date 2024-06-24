import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { CourseEntity } from "../../const";
import { findCoursesAdapter, FindCoursesState } from "../const";

export const loadFindCourses = createAsyncThunk<CourseEntity[]>(
    "my_courses/load",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/c/my");

            if (response.status === 200) {
                return response.data.subdata;
            } else {
                return thunkAPI.rejectWithValue(Rejector.standartReject());
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                Rejector.standartAxiosReject(error)
            );
        }
    }
);

export const loadFindCourses__Pending = (state: FindCoursesState) => {
    state.loading = LoadingStatus.Loading;
};

export const loadFindCourses__Fulfilled = (
    state: FindCoursesState,
    action: PayloadAction<CourseEntity[]>
) => {
    findCoursesAdapter.addMany(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const loadFindCourses__Rejected = (
    state: FindCoursesState,
    action: { payload: unknown } // vscode gave me an error without it.
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
