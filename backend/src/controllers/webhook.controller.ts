import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import crypto from "crypto";
import { RAZORPAY_WEBHOOK_SECRET } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { Subscription } from "../models/subscription.model";
import { ApiResponse } from "../utils/ApiResponse";

export const razorpayWebhook = asyncHandler(
    async (req: Request, res: Response) => {
        const rawBody = req.body as Buffer;

        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
            .update(req.body)
            .digest("hex");

        const razorpaySignature = req.headers["x-razorpay-signature"];

        if (expectedSignature !== razorpaySignature) {
            throw new ApiError(400, "Invalid signature");
        }

        const payload = JSON.parse(rawBody.toString("utf-8"));

        const razorpaySubscription = payload.payload.subscription.entity;

        const event = payload.event; // subscription.activated, subscription.cancelled
        console.log("Event:", event);

        console.log("FULL PAYLOAD:", JSON.stringify(payload, null, 2));

        if (event === "subscription.activated") {
            await Subscription.findOneAndUpdate(
                {
                    subscriptionId: razorpaySubscription.id,
                },
                {
                    status: "active",
                    currentPeriodEnd: new Date(
                        razorpaySubscription.current_end * 1000,
                    ),
                    cancelScheduled: false,
                },
            );
        }

        if (event === "subscription.cancelled") {
            await Subscription.findOneAndUpdate(
                {
                    subscriptionId: razorpaySubscription.id,
                },
                {
                    status: "cancelled",
                    currentPeriodEnd: null,
                    cancelScheduled: false,
                },
            );
        }

        if (event === "subscription.updated") {
            await Subscription.findOneAndUpdate(
                { subscriptionId: razorpaySubscription.id },
                {
                    status: razorpaySubscription.status,
                    currentPeriodEnd: new Date(
                        razorpaySubscription.current_end * 1000,
                    ),
                    
                    cancelScheduled: razorpaySubscription.cancel_at_cycle_end,
                },
            );
        }

        return res.status(200).json(new ApiResponse("Payment received", {}));
    },
);
