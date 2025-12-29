"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import UrlTable from "@/components/dashboard/UrlTable";
import CopyButton from "@/components/dashboard/CopyButton";

const Dashboard = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ message: "", shortUrl: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [urls, setUrls] = useState([]);

    const isValidUrl = (originalUrl: string) => {
        try {
            const parsed = new URL(originalUrl);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch (error) {
            return false;
        }
    };

    const onShortUrl = async () => {
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

            fetchAllUrls();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            } else {
                setResponse({ message: "Unexpected Error", shortUrl: "" });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUrls = async () => {
        try {
            const res = await api.get("/url/get-all");
            setUrls(res.data.data);
        } catch (error) {}
    };

    useEffect(() => {
        if (originalUrl.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [originalUrl]);

    useEffect(() => {
        fetchAllUrls();
    }, []);

    return (
        <div>
            <h1 className="font-medium text-2xl underline text-center mt-2">
                Dashboard
            </h1>
            <div className="flex justify-between">
                <div className="flex flex-col items-center w-[50%] mt-30">
                    <label htmlFor="url" className="mt-2">
                        URL:
                    </label>
                    <input
                        className="border outline-none p-2 rounded-lg w-[80%]"
                        type="text"
                        id="url"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="Enter url"
                    />
                    <div>
                        <button
                            className={`border bg-gray-200  ${
                                buttonDisabled ? "" : `hover:bg-gray-400`
                            } rounded-lg p-2 m-3 cursor-pointer`}
                            onClick={onShortUrl}
                        >
                            {loading ? "Submitting..." : "Short Url"}
                        </button>
                    </div>

                    {response.shortUrl && (
                        <div className="flex">
                            {/* {Short URL} */}
                            <Link
                                className="mt-3 mr-3 text-blue-500 focus:text-red-500 underline"
                                href={response.shortUrl}
                                target="_blank"
                            >
                                {response.shortUrl}
                            </Link>

                            <CopyButton shortUrl={response.shortUrl} />
                        </div>
                    )}

                    {response.message && (
                        <h1 className="font-medium text-2xl underline">
                            {response.message}
                        </h1>
                    )}
                </div>
                <div className="w-[50%] mr-10 mt-5 h-[78vh] overflow-y-auto">
                    <UrlTable urls={urls} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
