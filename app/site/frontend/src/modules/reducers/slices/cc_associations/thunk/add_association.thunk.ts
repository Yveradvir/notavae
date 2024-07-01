import { LaunchedAxios } from "@modules/api";
import { Rejector } from "@modules/reducers/rejector";
import { createAsyncThunk, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "@modules/constants/reducers.conts";
import { RejectedError } from "@modules/constants/rejector.const";
import { AssociationsEntity, ccAssociationsAdapter, ccAssociationsState } from "../const";

interface addCcAssociationI {
    associator_id: EntityId;
    body: {
        name: string;
        password: string | null;
    }
}

export const addCcAssociation = createAsyncThunk<AssociationsEntity, addCcAssociationI>(
    "current_course_associations/load",
    async ({body, associator_id}, thunkAPI) => {
        try {
            const response = await LaunchedAxios.post(`/c/single/${associator_id}/asso`, body);

            if (response.status === 201) {
                return response.data.subdata as AssociationsEntity;
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

export const addCcAssociation__Pending = (state: ccAssociationsState) => {
    state.loading = LoadingStatus.Loading;
};

export const addCcAssociation__Fulfilled = (
    state: ccAssociationsState,
    action: PayloadAction<AssociationsEntity>
) => {
    ccAssociationsAdapter.addOne(state, action.payload);
    state.loading = LoadingStatus.Loaded;
    state.error = null;
};

export const addCcAssociation__Rejected = (
    state: ccAssociationsState,
    action: { payload: unknown }
) => {
    state.error = action.payload as RejectedError;
    state.loading = LoadingStatus.Error;
};
