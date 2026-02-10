import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

const CancelSubscription = () => {
    const [isPro, setIsPro] = useState(null);
    const [loading, setLoading] = useState(false);

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

            alert(
                "Subscription cancellation scheduled. You will keep PRO access until the billing period ends.",
            );
        } catch (error) {
            alert("Failed to cancel subscription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStatus = async () => {
        const res = await api.get("/subscription/me");
        setIsPro(res.data.data.isPro);
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <div className="border rounded-xl p-6 bg-white max-w-lg">
            <h2 className="text-xl font-bold mb-2">Subscription</h2>

            {isPro ? (
                <>
                    <p className="text-green-600 font-medium mb-4">
                        You are currently on PRO plan.
                    </p>

                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 py-2 border border-red-500 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                        {loading ? "Cancelling..." : "Cancel Subscription"}
                    </button>
                </>
            ) : (
                <p className="text-gray-600">
                    You are currently on the FREE plan.
                </p>
            )}
        </div>
    );
};

export default CancelSubscription;
