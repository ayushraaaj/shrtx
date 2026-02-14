import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import crypto from "crypto";
import { RAZORPAY_PLAN_ID, RAZORPAY_WEBHOOK_SECRET } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { Subscription } from "../models/subscription.model";
import { ApiResponse } from "../utils/ApiResponse";
import razorpay from "../config/razorpay";

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

            return res
                .status(200)
                .json(new ApiResponse("Payment received", {}));
        }

        if (event === "subscription.cancelled") {
            const subscription = await Subscription.findOne({
                subscriptionId: razorpaySubscription.id,
            });

            if (!subscription) {
                return res
                    .status(200)
                    .json(new ApiResponse("Subscription not found", {}));
            }

            if (subscription?.autoRenew) {
                console.log(
                    "Auto-renew triggered. Creating new subscription...",
                );

                const newSubscription = await razorpay.subscriptions.create({
                    plan_id: RAZORPAY_PLAN_ID,
                    customer_notify: 1,
                    total_count: 120,
                });

                subscription.subscriptionId = newSubscription.id;
                subscription.status = "created";
                subscription.currentPeriodEnd = null;
                subscription.cancelScheduled = false;
                subscription.autoRenew = false;
                await subscription.save({ validateBeforeSave: false });

                return res
                    .status(200)
                    .json(
                        new ApiResponse("Auto-renew subscription created", {}),
                    );
            }

            subscription.status = "cancelled";
            subscription.currentPeriodEnd = null;
            subscription.cancelScheduled = false;
            await subscription.save({ validateBeforeSave: false });

            return res
                .status(200)
                .json(new ApiResponse("Subscription fully cancelled", {}));
        }
    },
);
