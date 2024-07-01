import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { CourseEntity, FiltersEntity } from "../../const";
import { findCoursesAdapter, FindCoursesState } from "../const";

interface loadFindCoursesI {
    courses: CourseEntity[]; 
    totalPages: number;
}

export const loadFindCourses = createAsyncThunk<loadFindCoursesI, number>(
    "find_courses/load",
    async (page, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as {
                profile: { instances: { profileEntity: { id: string } } };
                find_courses: { filters: FiltersEntity };
            };

            console.log("loadFindCourses", state);

            const response = await LaunchedAxios.get(`/c/find`, {
                params: {
                    page,
                    user_id: state.profile.instances.profileEntity.id,
                    ...state.find_courses.filters,
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
    action: PayloadAction<loadFindCoursesI>
) => {
    console.log(action.payload);
    
    findCoursesAdapter.setAll(state, action.payload.courses);
    
    state.totalPages = action.payload.totalPages
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const loadFindCourses__Rejected = (
    state: FindCoursesState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
