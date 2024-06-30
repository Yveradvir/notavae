import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_FEATURE_KEY, profileReducer } from "./slices/profile";
import { MY_COURSES_FEATURE_KEY, myCoursesReducer } from "./slices/courses/my_courses";
import { FIND_COURSES_FEATURE_KEY, findCoursesReducer } from "./slices/courses/find_courses";
import { CC_MEMBERSHIPS_FEATURE_KEY, ccMembershipsReducer } from "./slices/cc_memberships";

export const store = configureStore({
    reducer: {
        [PROFILE_FEATURE_KEY]: profileReducer,
        [MY_COURSES_FEATURE_KEY]: myCoursesReducer,
        [FIND_COURSES_FEATURE_KEY]: findCoursesReducer,
        [CC_MEMBERSHIPS_FEATURE_KEY]: ccMembershipsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: import.meta.env.DEV
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()