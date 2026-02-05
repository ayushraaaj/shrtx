"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const UrlPassword = () => {
    const searchParams = useSearchParams();

    const shortCode = searchParams.get("shortCode");
    const ref = searchParams.get("ref");

    const router = useRouter();

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onDone = async () => {
        if (!password) {
            setError("Please enter password");
            return;
        }

        try {
            const res = await api.post(`/url/verify-password`, {
                shortCode,
                password,
                ref,
            });
            router.replace(res.data.data.redirectUrl);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data.message ?? "Something went wrong",
                );
            } else {
                setError("Unexpected error");
            }
        }
    };

    return (
        <Suspense>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-51 p-4">
                <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Link Password</h2>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trim())}
                            className={`w-full border rounded p-2 ${
                                error ? "border-red-500 bg-red-50" : ""
                            }`}
                        />

                        {error && (
                            <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        {/* <button
                        // onClick={closeUrlPasswordModal}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button> */}

                        <button
                            onClick={onDone}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default UrlPassword;
