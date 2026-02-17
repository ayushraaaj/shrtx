"use client";
import { api, refreshApi } from "@/lib/axios";
import { setAccessToken } from "@/utils/auth";
import { useEffect, useState } from "react";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        try {
            const res = await refreshApi.post("/auth/refresh-token");

            setAccessToken(res.data.data.newAccessToken);
        } catch (error) {
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    if (loading) {
        return null;
    }

    return <>{children}</>;
};

export default ClientWrapper;
