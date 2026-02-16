import { getAccessToken, setAccessToken } from "@/utils/auth";
import axios from "axios";

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
    withCredentials: true,
});

export const refreshApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
    withCredentials: true,
});

// Request Interceptor: attaching bearer token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // window.location.href = "/login";

            try {
                const res = await refreshApi.post("/auth/refresh-token");

                setAccessToken(res.data.data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;

                return api(originalRequest);
            } catch (error) {
                setAccessToken(null);

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);
