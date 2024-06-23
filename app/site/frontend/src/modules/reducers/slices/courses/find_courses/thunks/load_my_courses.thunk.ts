import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MyCourseEntity, myCoursesAdapter, MyCoursesState } from "../const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";

export const loadMyCourses = createAsyncThunk<MyCourseEntity[]>(
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

export const loadMyCourses__Pending = (state: MyCoursesState) => {
    state.loading = LoadingStatus.Loading;
};

export const loadMyCourses__Fulfilled = (
    state: MyCoursesState,
    action: PayloadAction<MyCourseEntity[]>
) => {
    myCoursesAdapter.setAll(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const loadMyCourses__Rejected = (
    state: MyCoursesState,
    action: { payload: unknown } // vscode gave me an error without it.
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
