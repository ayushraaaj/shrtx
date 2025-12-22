"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
    const params = useParams();

    const [token, setToken] = useState("");
    const [response, setResponse] = useState("");

    const VerifyEmail = async () => {
        try {
            const res = await api.post("/auth/verifyemail", { token });
            setResponse(res.data.message);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error?.response?.data.message ?? "Something went wrong"
                );
            } else {
                setResponse("Unexpected error");
            }
        }
    };

    useEffect(() => {
        const urlToken = params.token as string;
        setToken(urlToken);
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            VerifyEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="font-medium text-2xl underline">
                Email verification
            </h1>
            {response && (
                <h1 className="font-medium text-2xl underline">{response}</h1>
            )}
            <p>You may close this tab</p>
        </div>
    );
};

export default VerifyEmail;
