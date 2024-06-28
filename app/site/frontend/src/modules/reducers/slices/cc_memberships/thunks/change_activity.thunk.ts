import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { ccMembershipsAdapter, ccMembershipsState, MembershipEntity } from "../const";

export const changeActivityCc = createAsyncThunk<MembershipEntity, EntityId>(
    "current_course_memberships/activity",
    async (course_id, thunkAPI) => {
        try {
            const response = await LaunchedAxios.patch(`/c/single/${course_id}/m/active`);

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

export const changeActivityCc__Pending = (state: ccMembershipsState) => {
    state.loading = LoadingStatus.Loading;
};

export const changeActivityCc__Fulfilled = (
    state: ccMembershipsState,
    action: PayloadAction<MembershipEntity>
) => {
    ccMembershipsAdapter.setOne(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const changeActivityCc__Rejected = (
    state: ccMembershipsState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
