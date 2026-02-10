import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import crypto from "crypto";
import { RAZORPAY_WEBHOOK_SECRET } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { Subscription } from "../models/subscription.model";
import { ApiResponse } from "../utils/ApiResponse";

export const razorpayWebhook = asyncHandler(
    async (req: Request, res: Response) => {
        console.log("🔔 Razorpay webhook received");

        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        const rawBody = req.body as Buffer;

        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
            .update(req.body)
            .digest("hex");

        const razorpaySignature = req.headers["x-razorpay-signature"];

        if (expectedSignature !== razorpaySignature) {
            console.log("❌ Signature mismatch");
            throw new ApiError(400, "Invalid signature");
        }

        console.log("✅ Signature verified");

        const payload = JSON.parse(rawBody.toString('utf-8'));

        const event = payload.event; // subscription.activated, subscription.cancelled
        console.log("Event:", event);

        if (event === "subscription.activated") {
            const razorpaySubscriptionId =
                req.body.payload.subscription.entity.id;

            console.log("Activating subscription:", razorpaySubscriptionId);

            await Subscription.findOneAndUpdate(
                {
                    subscriptionId: razorpaySubscriptionId,
                },
                { status: "active" },
            );
        }

        if (event === "subscription.cancelled") {
            const razorpaySubscriptionId =
                req.body.payload.subscription.entity.id;

            await Subscription.findOneAndUpdate(
                {
                    subscriptionId: razorpaySubscriptionId,
                },
                { status: "cancelled" },
            );
        }

        return res.status(200).json(new ApiResponse("Payment received", {}));
    },
);
