import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { ccAssociationsAdapter, ccAssociationsState } from "../const";

interface deleteCcAssociationI {
    associator_id: EntityId;
    associated_id: EntityId;
}

export const deleteCcAssociation = createAsyncThunk<EntityId, deleteCcAssociationI>(
    "current_course_memberships/kick",
    async ({associated_id, associator_id}, thunkAPI) => {
        try {
            const response = await LaunchedAxios.delete(`/c/single/${associator_id}/asso/${associated_id}`);

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

export const deleteCcAssociation__Pending = (state: ccAssociationsState) => {
    state.loading = LoadingStatus.Loading;
};

export const deleteCcAssociation__Fulfilled = (
    state: ccAssociationsState,
    action: PayloadAction<EntityId>
) => {
    ccAssociationsAdapter.removeOne(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const deleteCcAssociation__Rejected = (
    state: ccAssociationsState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
