import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { myCoursesAdapter, MyCoursesState } from "../const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { CourseEntity } from "../../const";

export const loadMyCourses = createAsyncThunk<CourseEntity[]>(
    "my_courses/load",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as {profile: {instances: {profileEntity: {id: string}}}, my_courses: {filters: object}}
            const response = await LaunchedAxios.get(`/p/single/${state.profile.instances.profileEntity.id}/courses`, {params: state.my_courses.filters});

            return response.data.subdata;
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
    action: PayloadAction<CourseEntity[]>
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
