import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { CourseEntity } from "../../const";
import { findCoursesAdapter, FindCoursesState } from "../const";

export const loadFindCourses = createAsyncThunk<CourseEntity[], number>(
    "find_courses/load",
    async (page, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as {
                profile: { instances: { profileEntity: { id: string } } };
                my_courses: { filters: object };
            };
            console.log(state);
            
            const response = await LaunchedAxios.get(`/c/find`, {
                params: {
                    page,
                    user_id: state.profile.instances.profileEntity.id,
                    ...state.my_courses.filters,
                },
            });

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
    state.hasMore = true;

    if (action.payload.length) {
        findCoursesAdapter.addMany(state, action.payload);
    } else state.hasMore = false;

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
