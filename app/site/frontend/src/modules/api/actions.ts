import { Axios, AxiosError } from "axios";
import { TodoModel } from "@modules/constants/api.const";
import { store } from "@modules/reducers";
import cookies from "@modules/utils/cookies";

import { loadMyProfileImage } from "@modules/reducers/slices/profile/thunks/load_my_pfp.thunk";
import { loadMyProfile } from "@modules/reducers/slices/profile/thunks/load_my_profile.thunk";
import { profileActions } from "@modules/reducers/slices/profile";
import { loadMyCourses } from "@modules/reducers/slices/courses/my_courses/thunks/load_my_courses.thunk";

export async function todo_execution(todo: TodoModel): Promise<void> {
    if (todo.user_profile_update) {
        await store.dispatch(loadMyProfile());
        await store.dispatch(loadMyProfileImage());
    } 
    if (todo.user_profile_unset) {
        store.dispatch(profileActions.reset())
    }
    if (todo.my_courses_update) {
        await store.dispatch(loadMyCourses());
    }
    if (todo.my_courses_unset) {
        store.dispatch(profileActions.reset())
    }
}

export async function error_execution(
    error: AxiosError,
    UnlaunchedAxios: Axios
): Promise<void> {
    async function refresh_token() {
        const refresh = cookies.get("refresh_csrf");
        if (refresh) {
            console.log("here");
            await UnlaunchedAxios.post(
                "/a/refresh",
                {},
                {
                    headers: { "X-CSRF-Token": refresh },
                }
            );
        }    
    }

    if (error.response?.status === 401) {
        await refresh_token()
    } else if (error.response?.status === 403) {
        if (error.response.data) {
            const data = error.response.data as {detail: string}
            if (data.detail === "Not authenticated") {
                await refresh_token()
            }
        }
    }
}
