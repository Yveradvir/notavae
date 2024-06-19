import axios, { AxiosError } from "axios";
import cookies from '../utils/cookies';
import { check_YvesResponse } from "@modules/utils/check_funcs";
import { todo_execution } from "./actions";
import { TodoModel } from "@modules/constants/api.const";

export const UnlaunchedAxios = axios.create({
    baseURL: import.meta.env.VITE_API, withCredentials: true
})

UnlaunchedAxios.interceptors.response.use(
    response => response,
    async error => {
        if (import.meta.env.DEV) console.error("[ UnlaunchedAxios:response::use#rejected > ", error);
        return Promise.reject(error)
    }
)

export const LaunchedAxios = axios.create({
    baseURL: import.meta.env.VITE_API, withCredentials: true
})

LaunchedAxios.interceptors.request.use(
    request => {
        if (import.meta.env.DEV) console.log("[ LaunchedAxios:request::use#fulfilled > ", request);
        
        const csrf = cookies.get("access_csrf")
        if (csrf) request.headers["X-CSRF-Token"] = csrf

        return request
    },
    async error => {
        if (import.meta.env.DEV) console.error("[ LaunchedAxi:request::use#rejected > ", error);
        return Promise.reject(error)
    }
);

LaunchedAxios.interceptors.response.use(
    async response => {
        if (import.meta.env.DEV) console.log("[ LaunchedAxios:response::use#fulfilled > ", response);
        
        if (check_YvesResponse(response)) todo_execution(response.data.todo as TodoModel)

        return response
    },
    async error => {
        if (import.meta.env.DEV) console.error("[ LaunchedAxios:response::use#rejected > ", error);

        if (error instanceof AxiosError) {            
            if (error.response?.status === 401) {
                const refresh = cookies.get("refresh_csrf")
                if (refresh) {
                    console.log("here");
                    await UnlaunchedAxios.post("/a/refresh", {}, {
                        headers: {"X-CSRF-Token" : refresh}
                    })
                }
            }
        }

        return Promise.reject(error)        
    }
);

export default {LaunchedAxios, UnlaunchedAxios}; 