import axios from "axios";

export const api = axios.create({
    // baseURL: "http://localhost:8000/api/v1",
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            if (window.location.pathname !== "/login") {
                window.location.href = "/login?expired=true";
            }
        }

        return Promise.reject(error);
    },
);
