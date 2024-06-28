import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { ccMembershipsAdapter, ccMembershipsState, MembershipEntity } from "../const";

interface changeStatusCcI {
    course_id: EntityId;
    status: string;
}

export const changeStatusCc = createAsyncThunk<MembershipEntity, changeStatusCcI>(
    "current_course_memberships/status",
    async ({course_id, status}, thunkAPI) => {
        try {
            const response = await LaunchedAxios.patch(`/c/single/${course_id}/m/status`, {status});

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

export const changeStatusCc__Pending = (state: ccMembershipsState) => {
    state.loading = LoadingStatus.Loading;
};

export const changeStatusCc__Fulfilled = (
    state: ccMembershipsState,
    action: PayloadAction<MembershipEntity>
) => {
    ccMembershipsAdapter.setOne(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const changeStatusCc__Rejected = (
    state: ccMembershipsState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
