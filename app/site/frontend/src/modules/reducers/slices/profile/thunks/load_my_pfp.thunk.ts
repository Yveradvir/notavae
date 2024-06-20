import {
    createAsyncThunk,
    PayloadAction,
    CaseReducer
} from "@reduxjs/toolkit";
import { ProfileState } from "../const";
import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { RejectedError } from "@modules/constants/rejector.const";
import { LoadingStatus } from "@modules/constants/reducers.conts";

export const loadMyProfileImage = createAsyncThunk<string | null>(
    "profile/image/load",
    async (_, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get("/p/my", {params: {act: 1}});
            
            if (response.status) {
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

export const loadMyProfileImage__Pending: CaseReducer<ProfileState> = (
    state
) => {
    state.loadings.profileImage = LoadingStatus.Loading;
};

export const loadMyProfileImage__Fulfilled: CaseReducer<ProfileState, PayloadAction<string | null>> = (
    state, 
    action
) => {
    state.instances.profileImage = action.payload;
    state.loadings.profileImage = action.payload ? LoadingStatus.Loaded : LoadingStatus.NotLoaded;
    state.errors.profileImage = null;
};

export const loadMyProfileImage__Rejected: CaseReducer<ProfileState> = (
    state,
    action
) => {
    state.errors.profileImage = action.payload as RejectedError;
    state.loadings.profileImage = LoadingStatus.Error;
}