import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: String,
            enum: ["FREE", "PRO"],
            default: "FREE",
            required: true,
        },
        subscriptionId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["created", "active", "cancelled"],
            default: "created",
            required: true,
        },
        currentPeriodEnd: {
            type: Date,
        },
        cancelScheduled: {
            type: Boolean,
            default: false,
        },
        autoRenew: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const Subscription = mongoose.model("subscriptions", subscriptionSchema);
