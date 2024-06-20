import { createSlice } from "@reduxjs/toolkit";
import { profileInitialState, ProfileState } from "./const";
import {
    loadMyProfile,
    loadMyProfile__Fulfilled,
    loadMyProfile__Pending,
    loadMyProfile__Rejected,
} from "./thunks/load_my_profile.thunk";
import {
    loadMyProfileImage,
    loadMyProfileImage__Fulfilled,
    loadMyProfileImage__Pending,
    loadMyProfileImage__Rejected,
} from "./thunks/load_my_pfp.thunk";

export const PROFILE_FEATURE_KEY = "profile";

const profileSlice = createSlice({
    name: PROFILE_FEATURE_KEY,
    initialState: profileInitialState as ProfileState,
    reducers: {
        reset: () => profileInitialState as ProfileState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMyProfile.pending, loadMyProfile__Pending)
            .addCase(loadMyProfile.fulfilled, loadMyProfile__Fulfilled)
            .addCase(loadMyProfile.rejected, loadMyProfile__Rejected)

            .addCase(loadMyProfileImage.pending, loadMyProfileImage__Pending)
            .addCase(loadMyProfileImage.fulfilled, loadMyProfileImage__Fulfilled)
            .addCase(loadMyProfileImage.rejected, loadMyProfileImage__Rejected);
    },
});

export const profileReducer = profileSlice.reducer;
export const profileActions = profileSlice.actions;
