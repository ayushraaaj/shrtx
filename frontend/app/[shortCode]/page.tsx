"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const OpenShortUrl = () => {
    const router = useRouter();

    const { shortCode } = useParams();

    useEffect(() => {
        router.replace(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${shortCode}`);
    }, []);
};

export default OpenShortUrl;
