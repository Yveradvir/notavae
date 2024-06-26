import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { myCoursesAdapter, MyCoursesState } from "../const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { CourseEntity } from "../../const";

export const joinToCourse = createAsyncThunk<CourseEntity, string>(
    "my_courses/join",
    async (course_id, thunkAPI) => {
        try {
            const response = await LaunchedAxios.post(`/c/${course_id}/m/join`);

            if (response.status === 201) {
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

export const joinToCourse__Pending = (state: MyCoursesState) => {
    state.loading = LoadingStatus.Loading;
};

export const joinToCourse__Fulfilled = (
    state: MyCoursesState,
    action: PayloadAction<CourseEntity>
) => {
    myCoursesAdapter.addOne(state, action.payload);

    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const joinToCourse__Rejected = (
    state: MyCoursesState,
    action: { payload: unknown } // vscode gave me an error without it.
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
