"use client";
import { AllUrlAnalytics } from "@/app/interfaces/url";
import { api } from "@/lib/axios";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
    ChartBarIcon,
    LinkIcon,
    CursorArrowRaysIcon,
    CheckBadgeIcon,
    ArrowDownTrayIcon,
    TagIcon,
} from "@heroicons/react/24/outline";
import * as htmlToImage from "html-to-image";
import StatCard from "../statcard/StatCard";
import ChartsCard from "./ChartsCard";

interface Props {
    fetchAnalyticsUrl: string;
    heading: string;
}

const Analytics = (props: Props) => {
    const { fetchAnalyticsUrl, heading } = props;

    const barChartRef = useRef<HTMLDivElement>(null);
    const pieChartRef = useRef<HTMLDivElement>(null);

    const [allUrlData, setAllUrlData] = useState<AllUrlAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [groupName, setGroupName] = useState("");

    const [exporting, setExporting] = useState(false);

    const captureChart = async (
        chartRef: React.RefObject<HTMLDivElement | null>
    ) => {
        if (!chartRef.current) {
            throw new Error("Chart not found");
        }

        return await htmlToImage.toPng(chartRef.current, {
            backgroundColor: "#ffffff",
            pixelRatio: 2,
        });
    };

    const handleExportPdf = async () => {
        try {
            setExporting(true);

            const barChartImage = await captureChart(barChartRef);
            const pieChartImage = await captureChart(pieChartRef);

            const res = await api.post(
                "/url/analytics/export/overview/pdf",
                {
                    charts: {
                        bar: barChartImage,
                        pie: pieChartImage,
                    },
                    heading,
                    groupName,
                },
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([res.data], {
                type: "application/pdf",
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `${heading}_${groupName}.pdf`;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Failed to export analytics", error);
        } finally {
            setExporting(false);
        }
    };

    const fetchAllUrlData = async () => {
        try {
            setLoading(true);

            const res = await api.get(fetchAnalyticsUrl);

            if (res.data.data.groupName) {
                setGroupName(res.data.data.groupName);
            }

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

    const truncate = (text: string, max: number) =>
        text.length > max ? text.slice(0, max) + "..." : text;

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
                <header className="mb-10 flex justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                                <ChartBarIcon className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight" title={ groupName}>
                                {heading}{" "}
                                {groupName && `(${truncate(groupName, 40)})`}
                            </h1>
                        </div>
                        <p className="text-zinc-500 font-medium">
                            Comprehensive performance tracking across all your
                            shortened links.
                        </p>
                    </div>

                    <button
                        onClick={handleExportPdf}
                        disabled={exporting}
                        className={`flex items-center gap-2 px-4 bg-white border border-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 active:scale-95 disabled:opacity-70 ${
                            exporting
                                ? "disabled:cursor-not-allowed"
                                : "cursor-pointer"
                        } shadow-sm shadow-blue-500/5`}
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 transition-transform" />

                        <span>
                            {exporting ? "Exporting..." : "Export Analytics"}
                        </span>
                    </button>
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

                {allUrlData?.refs && (
                    <ChartsCard
                        refs={allUrlData.refs}
                        barChartRef={barChartRef}
                        pieChartRef={pieChartRef}
                    />
                )}
            </div>
        </div>
    );
};

export default Analytics;
