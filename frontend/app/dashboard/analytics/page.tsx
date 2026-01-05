"use client";
import { AllUrlAnalytics } from "@/app/interfaces/url";
import { api } from "@/lib/axios";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ChartBarIcon,
    LinkIcon,
    CursorArrowRaysIcon,
    CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import StatCard from "@/components/statcard/StatCard";
import ChartsCard from "@/components/analytics/ChartsCard";

const Analytics = () => {
    const [allUrlData, setAllUrlData] = useState<AllUrlAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAllUrlData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/url/analytics/overview");
            setAllUrlData(res.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data.message ?? "Something went wrong"
                );
            } else {
                setError("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUrlData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-bold text-sm">
                        Loading analytics...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                            <ChartBarIcon className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                            Analytics Overview
                        </h1>
                    </div>
                    <p className="text-zinc-500 font-medium">
                        Comprehensive performance tracking across all your
                        shortened links.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        label="Total URLs"
                        value={allUrlData?.totalUrls || 0}
                        icon={<LinkIcon className="w-6 h-6" />}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        label="Active Links"
                        value={allUrlData?.activeUrls || 0}
                        icon={<CheckBadgeIcon className="w-6 h-6" />}
                        color="text-emerald-600"
                        bgColor="bg-emerald-50"
                    />
                    <StatCard
                        label="Total Clicks"
                        value={allUrlData?.totalClicks || 0}
                        icon={<CursorArrowRaysIcon className="w-6 h-6" />}
                        color="text-amber-600"
                        bgColor="bg-amber-50"
                    />
                </div>

                {allUrlData?.refs && <ChartsCard refs={allUrlData.refs} />}
            </div>
        </div>
    );
};

export default Analytics;
