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

            const res = await api.post("/auth/login", user);

            setResponse(res.data.message);
            router.push("/dashboard");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error?.response?.data.message ?? "Something went wrong"
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
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
                <h1 className="font-medium text-2xl underline">Login</h1>
                <label htmlFor="username" className="mt-2">
                    Username/email
                </label>
                <input
                    className="border outline-none p-2 rounded-lg"
                    type="text"
                    id="username"
                    value={user.username_email}
                    onChange={(e) =>
                        setUser({ ...user, username_email: e.target.value })
                    }
                    placeholder="Username or email"
                />

                <label htmlFor="password" className="mt-2">
                    Password
                </label>
                <input
                    className="border outline-none p-2 rounded-lg"
                    type="password"
                    id="password"
                    value={user.password}
                    onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                    }
                    placeholder="Password"
                />

                <button
                    className={`border bg-gray-200  ${
                        buttonDisabled ? "" : `hover:bg-gray-400`
                    } rounded-lg p-2 mt-3 cursor-pointer`}
                    onClick={onLogin}
                    disabled={buttonDisabled}
                >
                    {loading ? "Submitting..." : "Login"}
                </button>
                <Link
                    className="mt-3 text-blue-500 focus:text-red-500 underline"
                    href="/signup"
                >
                    Visit signup page here
                </Link>

                {response && (
                    <h1 className="font-medium text-2xl underline">
                        {response}
                    </h1>
                )}
            </div>
        </div>
    );
};

export default Login;
