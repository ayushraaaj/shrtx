"use client";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Signup = () => {
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
                setResponse("Invalid email");
                return;
            }

            setLoading(true);
            setButtonDisabled(true);

            const res = await api.post("/auth/signup", user);

            setResponse(res.data.message);
        } catch (error: any) {
            setResponse(error.response.data.message);
        } finally {
            setLoading(false);
            setButtonDisabled(false);
        }
    };

    useEffect(() => {
        if (
            user.username.length > 0 &&
            user.email.length > 0 &&
            user.fullname.length > 0 &&
            user.password.length > 0
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
                <h1 className="font-medium text-2xl underline">
                    {loading ? "Loading..." : "Signup"}
                </h1>
                <label htmlFor="username" className="mt-2">
                    Username
                </label>
                <input
                    className="border outline-none p-2 rounded-lg"
                    type="text"
                    id="username"
                    value={user.username}
                    onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                    }
                    placeholder="Username"
                />

                <label htmlFor="email" className="mt-2">
                    Email
                </label>
                <input
                    className="border outline-none p-2 rounded-lg"
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                    }
                    placeholder="Email"
                />

                <label htmlFor="username" className="mt-2">
                    Fullname
                </label>
                <input
                    className="border outline-none p-2 rounded-lg"
                    type="text"
                    id="fullname"
                    value={user.fullname}
                    onChange={(e) =>
                        setUser({ ...user, fullname: e.target.value })
                    }
                    placeholder="Fullname"
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
                    onClick={onSignup}
                    disabled={buttonDisabled}
                >
                    {loading ? "Submitting..." : "Signup"}
                </button>
                <Link
                    className="mt-3 text-blue-500 focus:text-red-500 underline"
                    href="/login"
                >
                    Visit login page here
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

export default Signup;
