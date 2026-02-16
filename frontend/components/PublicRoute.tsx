import { getAccessToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [showLoginSignup, setShowLoginSignup] = useState(false);

    useLayoutEffect(() => {
        const accessToken = getAccessToken();
        console.log(accessToken);

        if (accessToken) {
            router.replace("/dashboard");
        } else {
            setShowLoginSignup(true);
        }
    }, [router]);

    if (!showLoginSignup) {
        return null;
    }

    return <>{children}</>;
};

export default PublicRoute;
