"use client";
import { api } from "@/lib/axios";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { useEffect, useState } from "react";

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
}

const PricingPage = () => {
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [checking, setChecking] = useState(true);

    const handleUpgrade = async () => {
        try {
            setLoading(true);

            const loaded = await loadRazorpay();

            if (!loaded) {
                alert("Razorpay failed to load");
                return;
            }

            const res = await api.post("/subscription/create");

            const { subscriptionId, status } = res.data.data;

            if (status === "active") {
                window.location.href = "/dashboard/settings";
                return;
            }

            console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

            const razorpay = new window.Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionId,
                name: "Shrtx",
                description: "PRO Subscription",

                handler: async function (response: RazorpayResponse) {
                    console.log("Payment successful", response);

                    setProcessing(true);

                    let attempts = 0;

                    const interval = setInterval(async () => {
                        attempts++;

                        try {
                            const res = await api.get("/subscription/me");

                            if (res.data.data.isPro || attempts > 10) {
                                clearInterval(interval);
                                window.location.href = "/dashboard/settings";
                            }
                        } catch (error) {
                            clearInterval(interval);
                            window.location.href = "/dashboard/settings";
                        }
                    }, 1500);
                },
            });

            razorpay.open();
        } catch (error) {
            console.error("Upgrade error:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkProStatus = async () => {
        try {
            const res = await api.get("/subscription/me");

            if (res.data.data.isPro) {
                window.location.href = "/dashboard/settings";
            }
        } catch (error) {
            console.error("Error checking subscription", error);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        checkProStatus();
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Checking subscription status...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-16">
            <h1 className="text-4xl font-extrabold mb-4">Upgrade to PRO</h1>
            <p className="text-gray-600 mb-8">
                Unlock document processing and advanced features.
            </p>

            <div className="border rounded-xl p-6 bg-white shadow-sm">
                <h2 className="text-2xl font-bold mb-2">PRO</h2>
                <p className="text-gray-600 mb-4">₹199 / month</p>

                <ul className="mb-6 list-disc ml-6 text-gray-700">
                    <li>Document Processing</li>
                    <li>Url Password Protection</li>
                    <li>Url Expiration</li>
                    <li>Url Click Limit</li>
                </ul>

                <button
                    onClick={handleUpgrade}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                    disabled={loading || processing}
                >
                    {processing
                        ? "Redirecting..."
                        : loading
                          ? "Opening Payment..."
                          : "Upgrade Now"}
                </button>
            </div>
        </div>
    );
};

export default PricingPage;
