"use client";
import { api } from "@/lib/axios";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { useEffect, useState } from "react";

const PricingPage = () => {
    const [waitingForActivation, setWaitingForActivation] = useState(false);

    const handleUpgrade = async () => {
        try {
            const loaded = await loadRazorpay();

            if (!loaded) {
                alert("Razorpay failed to load");
                return;
            }

            const res = await api.post("/subscription/create");

            const { subscriptionId, status } = res.data.data;

            if (status === "active") {
                window.location.href = "/dashboard/document";
                return;
            }

            console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

            const razorpay = new window.Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionId,
                name: "Shrtx",
                description: "PRO Subscription",
            });

            console.log("Resume payment", subscriptionId);

            razorpay.open();
        } catch (error) {}
    };

    useEffect(() => {
        if (!waitingForActivation) {
            return;
        }

        const interval = setInterval(async () => {
            const res = await api.get("/subscription/me");

            if (res.data.data.isPro) {
                clearInterval(interval);
                window.location.href = "/dashboard/document";
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [waitingForActivation]);

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
                >
                    Upgrade Now
                </button>
            </div>

            {waitingForActivation && (
                <p className="mt-4 text-blue-600 font-medium">
                    Payment successful. Activating PRO...
                </p>
            )}
        </div>
    );
};

export default PricingPage;
