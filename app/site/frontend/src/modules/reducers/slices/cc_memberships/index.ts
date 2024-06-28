import { createSlice } from "@reduxjs/toolkit";
import { ccMembershipsInitialState } from "./const";
import {
    loadCcMemberships,
    loadCcMemberships__Fulfilled,
    loadCcMemberships__Pending,
    loadCcMemberships__Rejected,
} from "./thunks/load_cc_memberships.thunk";
import {
    changeActivityCc,
    changeActivityCc__Fulfilled,
    changeActivityCc__Pending,
    changeActivityCc__Rejected,
} from "./thunks/change_activity.thunk";
import { changeStatusCc } from "./thunks/change_status.thunk";
import {
    kickCcMember,
    kickCcMember__Fulfilled,
    kickCcMember__Pending,
    kickCcMember__Rejected,
} from "./thunks/kick_cc_member.thunk";

export const CC_MEMBERSHIPS_FEATURE_KEY = "current_course_memberships";

const ccMembershipsSlice = createSlice({
    name: CC_MEMBERSHIPS_FEATURE_KEY,
    initialState: ccMembershipsInitialState,
    reducers: {
        reset: () => ccMembershipsInitialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCcMemberships.pending, loadCcMemberships__Pending)
            .addCase(loadCcMemberships.fulfilled, loadCcMemberships__Fulfilled)
            .addCase(loadCcMemberships.rejected, loadCcMemberships__Rejected)

            .addCase(changeActivityCc.pending, changeActivityCc__Pending)
            .addCase(changeActivityCc.fulfilled, changeActivityCc__Fulfilled)
            .addCase(changeActivityCc.rejected, changeActivityCc__Rejected)

            .addCase(changeStatusCc.pending, changeActivityCc__Pending)
            .addCase(changeStatusCc.fulfilled, changeActivityCc__Rejected)
            .addCase(changeStatusCc.rejected, changeActivityCc__Pending)

            .addCase(kickCcMember.pending, kickCcMember__Pending)
            .addCase(kickCcMember.fulfilled, kickCcMember__Fulfilled)
            .addCase(kickCcMember.rejected, kickCcMember__Rejected);
    },
});

export const ccMembershipsReducer = ccMembershipsSlice.reducer;
export const ccMembershipsActions = ccMembershipsSlice.actions;
