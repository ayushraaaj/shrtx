"use client";
import { AllUrlAnalytics } from "@/app/interfaces/url";
import RefClicksBardChart from "@/components/analytics/RefClicksBarChart";
import RefClicksPieChart from "@/components/analytics/RefClicksPieChart";
import { api } from "@/lib/axios";
import axios from "axios";
import { useEffect, useState } from "react";

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
        return <h1>Loading analytics...</h1>;
    }

    return (
        <div>
            <h1>Analytics Page</h1>

            <div>
                <p>Total Urls: {allUrlData?.totalUrls}</p>
                <p>Active Urls: {allUrlData?.activeUrls}</p>
                <p>Total Clicks: {allUrlData?.totalClicks}</p>
            </div>
            {allUrlData?.refs && (
                <div>
                    <div>
                        <RefClicksPieChart refs={allUrlData.refs} />
                    </div>
                    <div className="mt-10">
                        <RefClicksBardChart refs={allUrlData.refs} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
