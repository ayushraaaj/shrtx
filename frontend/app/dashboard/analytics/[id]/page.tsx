"use client";
import { UrlAnalytics } from "@/app/interfaces/url";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeftIcon,
    ChartBarIcon,
    CursorArrowRaysIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import CopyButton from "@/components/dashboard/CopyButton";
import ChartsCard from "@/components/analytics/ChartsCard";

const AnalyticsForUrl = () => {
    const { id } = useParams();

    const [urlData, setUrlData] = useState<UrlAnalytics | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUrlData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/url/analytics/${id}`);
            setUrlData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchUrlData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-bold text-sm">
                        Loading detailed data...
                    </p>
                </div>
            </div>
        );
    }

    const shortFullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${urlData?.shortCode}`;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-6 mb-10">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-bold text-sm group"
                    >
                        <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                                <ChartBarIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                                    URL Analytics
                                </h1>
                                <p className="text-zinc-500 text-sm font-medium">
                                    Tracking data for your shortened link
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">
                                    Short Link
                                </span>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={shortFullUrl}
                                        target="_blank"
                                        className="text-xl font-bold text-blue-600 hover:underline flex items-center gap-2"
                                    >
                                        {shortFullUrl.replace(
                                            /(^\w+:|^)\/\//,
                                            ""
                                        )}
                                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                    </Link>
                                    <CopyButton shortUrl={shortFullUrl} />
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">
                                    Destination
                                </span>
                                <p className="text-zinc-600 font-medium truncate">
                                    {urlData?.originalUrl.replace(
                                        /(^\w+:|^)\/\//,
                                        ""
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex flex-col items-center justify-center text-center">
                            <div className="p-3 bg-white rounded-xl shadow-sm mb-3">
                                <CursorArrowRaysIcon className="w-6 h-6 text-amber-500" />
                            </div>
                            <p className="text-4xl font-black text-zinc-900">
                                {urlData?.clicks.toLocaleString()}
                            </p>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                Total Clicks
                            </p>
                        </div>
                    </div>
                </section>

                {urlData?.refs && <ChartsCard refs={urlData.refs} />}
            </div>
        </div>
    );
};

export default AnalyticsForUrl;
