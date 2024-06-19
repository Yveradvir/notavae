import {
    createAsyncThunk,
    PayloadAction,
    CaseReducer
} from "@reduxjs/toolkit";
import { ProfileEntity, ProfileState } from "../const";
import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { RejectedError } from "@modules/constants/rejector.const";
import { LoadingStatus } from "@modules/constants/reducers.conts";

export const loadMyProfile = createAsyncThunk<ProfileEntity>(
    "profile/get",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/p/my");

            if (response.data.ok) {
                return response.data.subdata as ProfileEntity;
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

export const loadMyProfile__Pending: CaseReducer<ProfileState> = (
    state
) => {
    state.loadings.profileEntity = LoadingStatus.Loading;
};

export const loadMyProfile__Fulfilled: CaseReducer<ProfileState, PayloadAction<ProfileEntity>> = (
    state, 
    action
) => {
    state.instances.profileEntity = action.payload;
    state.loadings.profileEntity = LoadingStatus.Loaded;
    state.errors.profileEntity = null;
};

export const loadMyProfile__Rejected: CaseReducer<ProfileState> = (
    state,
    action
) => {
    state.errors.profileEntity = action.payload as RejectedError;
    state.loadings.profileEntity = LoadingStatus.Error;
}