import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { myCoursesAdapter, MyCoursesState } from "../const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { CourseEntity } from "../../const";
import { AxiosError } from "axios";
import { loadMyCourses } from "./load_my_courses.thunk";

export const joinToCourse = createAsyncThunk<CourseEntity, {course_id: EntityId, password: null | string;}>(
    "my_courses/join",
    async ({course_id, password}, thunkAPI) => {
        try {
            const response = await LaunchedAxios.post(`/c/single/${course_id}/m/join`, {password});

            if (response.status === 201) {
                return response.data.subdata;
            } else {
                return thunkAPI.rejectWithValue(Rejector.standartReject());
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    await thunkAPI.dispatch(loadMyCourses())
                }
            }

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
