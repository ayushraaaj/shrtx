"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
    const router = useRouter();

    const [user, setUser] = useState({ username_email: "", password: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");

    const onLogin = async () => {
        try {
            setLoading(true);
            setResponse("");
            const res = await api.post("/auth/login", user);
            setResponse(res.data.message);

            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error?.response?.data.message ?? "Invalid credentials",
                );
            } else {
                setResponse("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.username_email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4">
            <Link href="/" className="mb-8 text-2xl font-bold text-blue-600">
                shrtx<span className="text-zinc-400">.</span>
            </Link>

            <div className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Welcome back
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Sign in to manage your short links.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1">
                            Username or Email
                        </label>
                        <input
                            className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900"
                            type="text"
                            value={user.username_email}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    username_email: e.target.value,
                                })
                            }
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-semibold text-zinc-700">
                                Password
                            </label>
                            <Link
                                href="#"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!buttonDisabled || !loading) {
                                    onLogin();
                                }
                            }}
                        >
                            <input
                                className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-900"
                                type="password"
                                value={user.password}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="••••••••"
                            />

                            <button
                                type="submit"
                                className={`w-full py-3.5 rounded-xl font-bold transition-all mt-6 ${
                                    buttonDisabled || loading
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-[0.98]"
                                }`}
                                onClick={onLogin}
                                disabled={buttonDisabled || loading}
                            >
                                {loading ? "Signing in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>

                {response && (
                    <div
                        className={`mt-4 p-3 rounded-lg text-sm font-medium text-center border ${
                            response.toLowerCase().includes("success")
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100"
                        }`}
                    >
                        {response}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
