import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useCheckAuth = () => {
    const router = useRouter();

    const verifyAuth = async () => {
        try {
            await api.get("/auth/me");
            router.replace("/dashboard");
        } catch (error) {}
    };

    useEffect(() => {
        verifyAuth();
    }, [router]);
};
