"use client";
import { UrlAnalytics } from "@/app/interfaces/url";
import RefClicksBardChart from "@/components/analytics/RefClicksBarChart";
import RefClicksPieChart from "@/components/analytics/RefClicksPieChart";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const AnalyticsForUrl = () => {
    const { id } = useParams();

    const [urlData, setUrlData] = useState<UrlAnalytics | null>(null);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchUrlData = async () => {
        try {
            setLoading(true);
            console.log(id);

            const res = await api.get(`/url/analytics/${id}`);

            setUrlData(res.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error.response?.data.message ?? "Something went wrong"
                );
            } else {
                setResponse("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrlData();
    }, [id]);

    if (loading) {
        return <h1>Loading analytics...</h1>;
    }

    return (
        <div>
            <h1>
                Analytics for{" "}
                <Link
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${urlData?.shortCode}`}
                >{`${process.env.NEXT_PUBLIC_BACKEND_URL}/${urlData?.shortCode}`}</Link>
            </h1>
            <p>
                <Link
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${urlData?.shortCode}`}
                >
                    {urlData?.originalUrl}
                </Link>
            </p>
            <div>
                <p>Total Clicks: {urlData?.clicks}</p>
            </div>
            <div>
                {urlData?.refs && (
                    <div>
                        <div>
                            <RefClicksPieChart refs={urlData.refs} />
                        </div>
                        <div className="mt-10">
                            <RefClicksBardChart refs={urlData?.refs} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsForUrl;
