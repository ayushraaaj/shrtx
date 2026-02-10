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

        const event = payload.event; // subscription.activated, subscription.cancelled
        console.log("Event:", event);

        // console.log("FULL PAYLOAD:", JSON.stringify(payload, null, 2));

        if (event === "subscription.activated") {
            const razorpaySubscriptionId =
                payload.payload.subscription.entity.id;

            await Subscription.findOneAndUpdate(
                {
                    subscriptionId: razorpaySubscriptionId,
                },
                { status: "active" },
            );
        }

        if (event === "subscription.cancelled") {
            const razorpaySubscriptionId =
                payload.payload.subscription.entity.id;

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
