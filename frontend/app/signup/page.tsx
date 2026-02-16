"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Signup = () => {
    const router = useRouter();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [user, setUser] = useState({
        username: "",
        email: "",
        fullname: "",
        password: "",
    });
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const onSignup = async () => {
        try {
            if (!isValidEmail(user.email)) {
                setResponse("Please enter a valid email address.");
                return;
            }
            setLoading(true);
            setResponse("");
            const res = await api.post("/auth/signup", user);
            setResponse(res.data.message);

            setTimeout(() => {
                router.push("/login");
            }, 1000);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error?.response?.data.message ?? "Something went wrong",
                );
            } else {
                setResponse("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFormValid = Object.values(user).every((val) => val.length > 0);
        setButtonDisabled(!isFormValid);
    }, [user]);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4">
            <Link href="/" className="mb-8 text-2xl font-bold text-blue-600">
                shrtx<span className="text-zinc-400">.</span>
            </Link>

            <div className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-900">
                        Create an account
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Enter your details to get started with shrtx.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!buttonDisabled && !loading) {
                            onSignup();
                        }
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                Full Name
                            </label>
                            <input
                                className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                type="text"
                                value={user.fullname}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        fullname: e.target.value,
                                    })
                                }
                                placeholder="Ayush Raj"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                Username
                            </label>
                            <input
                                className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                type="text"
                                value={user.username}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        username: e.target.value,
                                    })
                                }
                                placeholder="ayushraj123"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                Email
                            </label>
                            <input
                                className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                type="text"
                                value={user.email}
                                onChange={(e) =>
                                    setUser({ ...user, email: e.target.value })
                                }
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                Password
                            </label>
                            <input
                                className="w-full border border-zinc-200 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3.5 rounded-xl font-bold transition-all mt-2 ${
                                buttonDisabled || loading
                                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-[0.98]"
                            }`}
                            // onClick={onSignup}
                            disabled={buttonDisabled || loading}
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </div>
                </form>

                {response && (
                    <div
                        className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${
                            response.includes("success") ||
                            response.includes("Created")
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                        }`}
                    >
                        {response}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
