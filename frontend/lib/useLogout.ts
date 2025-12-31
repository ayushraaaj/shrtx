import axios from "axios";
import { useRouter } from "next/navigation";
import { api } from "./axios";

export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {
            const res = await api.post("/auth/logout");

            setTimeout(() => {
                router.replace("/login");
            }, 1000);
            
            return { message: res.data.message };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    message:
                        error.response?.data.message ?? "Something went wrong",
                };
            } else {
                return { message: "Unexpected error" };
            }
        }
    };
    return logout;
};
