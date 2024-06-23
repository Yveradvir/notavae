import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { myCoursesAdapter, MyCoursesState } from "../const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";

export const leaveCourse = createAsyncThunk<EntityId, string>(
    "my_courses/leave",
    async (course_id, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get(`/c/${course_id}/m/leave`);

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

export const leaveCourse__Pending = (state: MyCoursesState) => {
    state.loading = LoadingStatus.Loading;
};

export const leaveCourse__Fulfilled = (
    state: MyCoursesState,
    action: PayloadAction<EntityId>
) => {
    myCoursesAdapter.removeOne(state, action.payload);

    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const leaveCourse__Rejected = (
    state: MyCoursesState,
    action: { payload: unknown } // vscode gave me an error without it.
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
