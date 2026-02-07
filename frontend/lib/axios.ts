import axios from "axios";

export const api = axios.create({
    // baseURL: "http://localhost:8000/api/v1",
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1`,
    withCredentials: true,
});
