import { Axios, AxiosError } from "axios";
import { TodoModel } from "@modules/constants/api.const";
import { store } from "@modules/reducers";
import cookies from "@modules/utils/cookies";

import { loadMyProfileImage } from "@modules/reducers/slices/profile/thunks/load_my_pfp.thunk";
import { loadMyProfile } from "@modules/reducers/slices/profile/thunks/load_my_profile.thunk";
import { profileActions } from "@modules/reducers/slices/profile";

export async function todo_execution(todo: TodoModel): Promise<void> {
    if (todo.user_profile_update) {
        await store.dispatch(loadMyProfile());
        await store.dispatch(loadMyProfileImage());
    } else if (todo.user_profile_unset) {
        store.dispatch(profileActions.reset())
    }
}

export async function error_execution(
    error: AxiosError,
    UnlaunchedAxios: Axios
): Promise<void> {
    if (error.response?.status === 401) {
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
}
