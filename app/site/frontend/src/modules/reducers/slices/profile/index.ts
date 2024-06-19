import { createSlice } from "@reduxjs/toolkit";
import { ProfileState } from "./const";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { loadMyProfile, loadMyProfile__Fulfilled, loadMyProfile__Pending, loadMyProfile__Rejected } from "./thunks/load_my_profile.thunk";

export const PROFILE_FEATURE_KEY = "profile";


const profileSlice = createSlice({
    name: PROFILE_FEATURE_KEY,
    initialState: {
        instances: {
            profileEntity: null,
            profileImage: null
        },
        loadings: {
            profileEntity: LoadingStatus.ANotLoaded,
            profileImage: LoadingStatus.ANotLoaded
        },
        errors: {
            profileEntity: null,
            profileImage: null
        }
    } as ProfileState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMyProfile.pending, loadMyProfile__Pending).addCase(loadMyProfile.fulfilled, loadMyProfile__Fulfilled).addCase(loadMyProfile.rejected, loadMyProfile__Rejected)
    }
})

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;