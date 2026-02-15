"use client";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCheckAuth = () => {
    const router = useRouter();

    const verifyAuth = async () => {
        try {
            await api.get("/auth/me");
        } catch (error) {
            router.replace("/login");
        }
    };

    useEffect(() => {
        verifyAuth();
    }, [router]);
};
