import axios from "axios";
import { useRouter } from "next/navigation";
import { api } from "../../lib/axios";
import { setAccessToken } from "@/utils/auth";

export const useLogout = () => {
    const router = useRouter();

    const logout = async () => {
        try {
            const res = await api.post("/auth/logout");

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
        } finally {
            setAccessToken(null);

            router.replace("/login");
        }
    };
    return logout;
};
