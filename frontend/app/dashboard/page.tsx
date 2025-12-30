"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import UrlTable from "@/components/dashboard/UrlTable";
import CopyButton from "@/components/dashboard/CopyButton";
import { UrlApiItem } from "../interfaces/url";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    LinkIcon,
    InformationCircleIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ message: "", shortUrl: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [urls, setUrls] = useState<UrlApiItem[]>([]);
    const [page, setPage] = useState(1);
    const [isRemaining, setIsRemaining] = useState(true);
    const [searchText, setSearchText] = useState("");

    const isValidUrl = (url: string) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    const onShortUrl = async () => {
        if (!isValidUrl(originalUrl)) {
            setResponse({
                message: "Please enter a valid URL (include http/https)",
                shortUrl: "",
            });
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/url", { originalUrl });

            setResponse({
                message: res.data.message,
                shortUrl: res.data.data,
            });

            setIsRemaining(true);
            setPage(1);
            fetchAllUrls(1);
        } catch (error: unknown) {
            const errorMsg = axios.isAxiosError(error)
                ? error.response?.data.message
                : "Unexpected Error";
            setResponse({ message: errorMsg, shortUrl: "" });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUrls = async (pageNumber: number) => {
        try {
            setLoading(true);
            const res = await api.get(
                `/url/get-all?page=${pageNumber}&search=${searchText}`
            );

            const urlsData = res.data.data.urls;

            setUrls((prev) => {
                if (pageNumber === 1) return urlsData;
                const existingIds = new Set(prev.map((url) => url._id));
                const uniqueItems = urlsData.filter(
                    (url: UrlApiItem) => !existingIds.has(url._id)
                );
                return [...prev, ...uniqueItems];
            });

            if (urlsData.length < 5) setIsRemaining(false);
        } catch (error) {
            console.error("Failed to fetch URLs", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAllUrls(nextPage);
    };

    useEffect(() => {
        setButtonDisabled(originalUrl.length === 0);
    }, [originalUrl]);

    useEffect(() => {
        setPage(1);
        setIsRemaining(true);
        fetchAllUrls(1);
    }, [searchText]);

    return (
        <div className="min-h-screen bg-zinc-50 pt-10 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-zinc-500 mt-1">
                            Manage and track your shortened links performance.
                        </p>
                    </div>

                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            />
                        </svg>
                        Logout
                    </button>
                </header>

                <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LinkIcon className="h-5 w-5 text-zinc-400" />
                            </div>
                            <input
                                className="w-full bg-zinc-50 border border-zinc-200 outline-none pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-zinc-900 placeholder:text-zinc-400"
                                type="text"
                                value={originalUrl}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                placeholder="Paste your long link here..."
                            />
                        </div>
                        <button
                            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                                buttonDisabled || loading
                                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                            }`}
                            onClick={onShortUrl}
                            disabled={buttonDisabled || loading}
                        >
                            {loading ? (
                                "Working..."
                            ) : (
                                <>
                                    <PlusIcon className="w-5 h-5" /> Shorten
                                    Link
                                </>
                            )}
                        </button>
                    </div>

                    {response.message && (
                        <div
                            className={`mt-8 p-5 rounded-2xl border animate-in fade-in slide-in-from-top-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                                response.message
                                    .toLowerCase()
                                    .includes("already")
                                    ? "bg-amber-50 border-amber-100"
                                    : response.shortUrl
                                    ? "bg-blue-50 border-blue-100"
                                    : "bg-red-50 border-red-100"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2.5 rounded-xl ${
                                        response.message
                                            .toLowerCase()
                                            .includes("already")
                                            ? "bg-amber-100 text-amber-600"
                                            : "bg-blue-100 text-blue-600"
                                    }`}
                                >
                                    {response.message
                                        .toLowerCase()
                                        .includes("already") ? (
                                        <InformationCircleIcon className="w-6 h-6" />
                                    ) : (
                                        <CheckCircleIcon className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <p
                                        className={`text-xs font-bold uppercase tracking-widest ${
                                            response.message
                                                .toLowerCase()
                                                .includes("already")
                                                ? "text-amber-700"
                                                : "text-blue-700"
                                        }`}
                                    >
                                        {response.message}
                                    </p>
                                    {response.shortUrl && (
                                        <Link
                                            href={response.shortUrl}
                                            target="_blank"
                                            className="text-zinc-900 font-bold hover:text-blue-600 transition-colors break-all"
                                        >
                                            {response.shortUrl}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {response.shortUrl && (
                                <CopyButton shortUrl={response.shortUrl} />
                            )}
                        </div>
                    )}
                </section>

                <section className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-50/30">
                        <h2 className="text-lg font-bold text-zinc-800">
                            Your URL History
                        </h2>

                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 text-zinc-400" />
                            </div>
                            <input
                                className="w-full bg-white border border-zinc-200 outline-none pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-blue-500 transition-all shadow-sm"
                                type="text"
                                placeholder="Search links..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="min-h-[300px]">
                        <UrlTable urls={urls} />

                        {urls.length === 0 && !loading && (
                            <div className="py-20 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                    <LinkIcon className="w-8 h-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-500 font-medium">
                                    No links found yet.
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    Start shortening to see your history here.
                                </p>
                            </div>
                        )}
                    </div>

                    {isRemaining && (
                        <div className="p-6 border-t border-zinc-100 flex justify-center">
                            <button
                                className="cursor-pointer text-sm font-bold text-zinc-600 hover:text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl transition-all disabled:opacity-50"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading more..."
                                    : "Load More Activity"}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
