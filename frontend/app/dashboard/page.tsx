"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Dashboard = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ message: "", shortUrl: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const isValidUrl = (originalUrl: string) => {
        try {
            const parsed = new URL(originalUrl);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch (error) {
            return false;
        }
    };

    const onSubmit = async () => {
        if (!isValidUrl(originalUrl)) {
            setResponse({ message: "Please enter a valid url", shortUrl: "" });
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/url", { originalUrl });
            setResponse({
                message: res.data.message,
                shortUrl: res.data.data,
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error.response?.data.message ?? "Something went wrong"
                );
            } else {
                setResponse({ message: "Unexpected Error", shortUrl: "" });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (originalUrl.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [originalUrl]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="font-medium text-2xl underline">Dashboard</h1>
            <label htmlFor="url" className="mt-2">
                URL:
            </label>
            <input
                className="border outline-none p-2 rounded-lg"
                type="text"
                id="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Enter url"
            />

            <button
                className={`border bg-gray-200  ${
                    buttonDisabled ? "" : `hover:bg-gray-400`
                } rounded-lg p-2 mt-3 cursor-pointer`}
                onClick={onSubmit}
                disabled={buttonDisabled}
            >
                {loading ? "Submitting..." : "Submit"}
            </button>

            {response.shortUrl && (
                <div>
                    {/* {Short URL} */}
                    <Link
                        className="mt-3 text-blue-500 focus:text-red-500 underline"
                        href={response.shortUrl}
                        target="_blank"
                    >
                        {response.shortUrl}
                    </Link>
                    {/* {QR Code} */}
                    <QRCodeCanvas value={response.shortUrl} />
                </div>
            )}
            {response.message && (
                <h1 className="font-medium text-2xl underline">
                    {response.message}
                </h1>
            )}
        </div>
    );
};

export default Dashboard;
