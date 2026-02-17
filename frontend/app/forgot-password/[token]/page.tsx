"use client";
import PublicRoute from "@/components/PublicRoute";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SetForgotPassword = () => {
    const router = useRouter();
    const { token } = useParams();

    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState({ message: "", success: false });
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const forgotPassword = async () => {
        try {
            setLoading(true);
            setResponse({ message: "", success: false });

            const res = await api.post("/auth/reset-password", {
                password,
                token,
            });

            setResponse({ message: res.data.message, success: true });

            setTimeout(() => {
                router.replace("/login");
            }, 5000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    success: false,
                });
            } else {
                setResponse({ message: "Unexpected error", success: false });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [password]);

    return (
        <PublicRoute>
            <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4">
                <Link
                    href="/"
                    className="mb-8 text-2xl font-bold text-blue-600"
                >
                    shrtx<span className="text-zinc-400">.</span>
                </Link>

                <div className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-zinc-900">
                            Password Reset
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Set new password to continue using Shrtx.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!buttonDisabled && !loading) {
                                forgotPassword();
                            }
                        }}
                    >
                        <div className="space-y-7">
                            <div>
                                <input
                                    className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                                        buttonDisabled || loading
                                            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-[0.98]"
                                    }`}
                                    disabled={buttonDisabled || loading}
                                >
                                    {loading ? "Setting..." : "Set"}
                                </button>
                            </div>
                        </div>
                    </form>

                    {response.message && (
                        <div
                            className={`mt-4 p-3 rounded-lg text-sm font-medium text-center border ${
                                response.success
                                    ? "bg-green-50 text-green-600 border-green-100"
                                    : "bg-red-50 text-red-600 border-red-100"
                            }`}
                        >
                            {response.message}
                        </div>
                    )}
                </div>
            </div>
        </PublicRoute>
    );
};

export default SetForgotPassword;
