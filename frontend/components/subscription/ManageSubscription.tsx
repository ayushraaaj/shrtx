import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Subscription {
    isPro: boolean;
    cancelScheduled?: boolean;
    currentPeriodEnd?: string | null;
}

const ManageSubscription = () => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(false);

    // const handleResume = async () => {
    //     try {
    //         setLoading(true);

    //         await api.post("/subscription/resume");

    //         await fetchSubscription();
    //     } catch (error) {
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleCancel = async () => {
        const confirmed = window.confirm(
            "Your PRO plan will remain active until the end of the current billing cycle. Do you want to continue?",
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await api.post("/subscription/cancel");

            await fetchSubscription();

            alert(
                "Subscription cancellation scheduled. You will keep PRO access until the billing period ends.",
            );
        } catch (error) {
            alert("Failed to cancel subscription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        const res = await api.get("/subscription/me");
        setSubscription(res.data.data);
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    if (!subscription) {
        return <p>Loading subscription details...</p>;
    }

    return (
        <div className="border rounded-xl p-6 bg-white max-w-lg">
            <h2 className="text-xl font-bold mb-2">Subscription</h2>

            {!subscription.isPro && (
                <div>
                    <p className="text-gray-600 mb-4">
                        You are currently on the FREE plan.
                    </p>
                    <Link
                        href="/pricing"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                    >
                        Upgrade to PRO
                    </Link>
                </div>
            )}

            {subscription.isPro && !subscription.cancelScheduled && (
                <div>
                    <p className="text-green-600 font-medium mb-2">
                        PRO plan active
                    </p>

                    {subscription.currentPeriodEnd && (
                        <p className="text-sm text-gray-600 mb-4">
                            Active until{" "}
                            <span className="font-medium">
                                {new Date(
                                    subscription.currentPeriodEnd,
                                ).toLocaleDateString()}
                            </span>
                        </p>
                    )}

                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Cancel Subscription"}
                    </button>
                </div>
            )}

            {subscription.isPro && subscription.cancelScheduled && (
                <>
                    <p className="text-yellow-600 font-medium mb-2">
                        Cancellation Scheduled
                    </p>

                    {subscription.currentPeriodEnd && (
                        <p className="text-sm text-gray-600 mb-4">
                            Your PRO access will end on{" "}
                            <span className="font-medium">
                                {new Date(
                                    subscription.currentPeriodEnd,
                                ).toLocaleDateString()}
                            </span>
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageSubscription;
