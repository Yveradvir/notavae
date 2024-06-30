import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { AssociationsEntity, ccAssociationsAdapter, ccAssociationsState } from "../const";

export const loadCcAssociations = createAsyncThunk<AssociationsEntity[], EntityId>(
    "current_course_associations/load",
    async (course_id, thunkAPI) => {
        try {
            const response = await LaunchedAxios.get(`/c/single/${course_id}/asso`);

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

export const loadCcAssociations__Pending = (state: ccAssociationsState) => {
    state.loading = LoadingStatus.Loading;
};

export const loadCcAssociations__Fulfilled = (
    state: ccAssociationsState,
    action: PayloadAction<AssociationsEntity[]>
) => {
    ccAssociationsAdapter.setMany(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const loadCcAssociations__Rejected = (
    state: ccAssociationsState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
