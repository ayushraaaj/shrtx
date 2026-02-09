"use client";
import { api } from "@/lib/axios";
import { loadRazorpay } from "@/utils/loadRazorpay";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PayButton = () => {
    const handlePay = async () => {
        await loadRazorpay();

        const { data: order } = await api.post("/payment/create-order", {
            amount: 200,
        });

        const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "ShrtX App",
            description: "Test Payment",
            order_id: order.id,
            handler: async (response: any) => {
                console.log(response);
                const verify = await api.post("/payment/verify", response);
                if (verify.data.success) alert("Payment successful!");
                else alert("Payment verification failed!");
            },
            theme: { color: "#3399cc" },
        });

        rzp.open();
    };

    return <button onClick={handlePay}>Pay ₹200</button>;
};

export default PayButton;
