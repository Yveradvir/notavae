import { createSlice } from "@reduxjs/toolkit";
import {
    ccAssociationsInitialState,
} from "./const";
import {
    loadCcAssociations,
    loadCcAssociations__Fulfilled,
    loadCcAssociations__Pending,
    loadCcAssociations__Rejected,
} from "./thunk/load_associations.thunk";

export const CC_ASSOCIATIONS_FEATURE_KEY = "current_course_associations";

const ccAssociationsSlice = createSlice({
    name: CC_ASSOCIATIONS_FEATURE_KEY,
    initialState: ccAssociationsInitialState,
    reducers: {
        reset: () => ccAssociationsInitialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCcAssociations.pending, loadCcAssociations__Pending)
            .addCase(loadCcAssociations.fulfilled, loadCcAssociations__Fulfilled)
            .addCase(loadCcAssociations.rejected, loadCcAssociations__Rejected);
    },
});

export const ccAssociationsReducer = ccAssociationsSlice.reducer;
export const ccAssociationsActions = ccAssociationsSlice.actions;
