import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { ccMembershipsAdapter, ccMembershipsState } from "../const";

interface kickCcMemberI {
    course_id: EntityId;
    kicked_id: EntityId;
}

export const kickCcMember = createAsyncThunk<EntityId, kickCcMemberI>(
    "current_course_memberships/kick",
    async ({course_id, kicked_id}, thunkAPI) => {
        try {
            const response = await LaunchedAxios.delete(`/c/single/${course_id}/m/kick/${kicked_id}`);

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

export const kickCcMember__Pending = (state: ccMembershipsState) => {
    state.loading = LoadingStatus.Loading;
};

export const kickCcMember__Fulfilled = (
    state: ccMembershipsState,
    action: PayloadAction<EntityId>
) => {
    ccMembershipsAdapter.removeOne(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const kickCcMember__Rejected = (
    state: ccMembershipsState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
