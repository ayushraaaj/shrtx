"use client";
import { getAccessToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [isAuthorized, setIsAuthorized] = useState(false);

    useLayoutEffect(() => {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
