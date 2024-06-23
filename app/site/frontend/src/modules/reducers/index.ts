import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_FEATURE_KEY, profileReducer } from "./slices/profile";
import { MY_COURSES_FEATURE_KEY, myCoursesReducer } from "./slices/courses/my_courses";

export const store = configureStore({
    reducer: {
        [PROFILE_FEATURE_KEY]: profileReducer,
        [MY_COURSES_FEATURE_KEY]: myCoursesReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: import.meta.env.DEV
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()