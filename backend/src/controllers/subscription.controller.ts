import { Request, response, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Subscription } from "../models/subscription.model";
import { ApiResponse } from "../utils/ApiResponse";
import razorpay from "../config/razorpay";
import { RAZORPAY_PLAN_ID } from "../config/env";
import { ApiError } from "../utils/ApiError";

export const createSubscription = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const existingSubscription = await Subscription.findOne({
            userId,
            status: { $in: ["created", "active"] },
        });

        if (existingSubscription) {
            return res.status(200).json(
                new ApiResponse("Subscription already exists", {
                    subscriptionId: existingSubscription.subscriptionId,
                    status: existingSubscription.status,
                }),
            );
        }

        const razorpaySubscription = await razorpay.subscriptions.create({
            plan_id: RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 120,
        });

        const subscription = await Subscription.create({
            userId,
            plan: "PRO",
            subscriptionId: razorpaySubscription.id,
            status: "created",
        });

        return res.status(201).json(
            new ApiResponse("Subscription added", {
                subscriptionId: subscription.subscriptionId,
            }),
        );
    },
);

export const proSubscription = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const subscription = await Subscription.findOne({
            userId,
            status: "active",
        });

        if (!subscription) {
            return res.status(200).json(new ApiResponse("", { isPro: false }));
        }

        return res.status(200).json(
            new ApiResponse("", {
                isPro: true,
                cancelScheduled: subscription.cancelScheduled,
                currentPeriodEnd: subscription.currentPeriodEnd,
            }),
        );
    },
);

export const cancelSubscription = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const subscription = await Subscription.findOne({
            userId,
            status: "active",
        });

        if (!subscription) {
            throw new ApiError(400, "No active subscription found");
        }

        await razorpay.subscriptions.cancel(subscription.subscriptionId, 1);

        return res
            .status(200)
            .json(new ApiResponse("Subscription cancelled", {}));
    },
);

export const resumeSubscription = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const subscription = await Subscription.findOne({ userId });

        if (!subscription) {
            throw new ApiError(404, "No subscription found");
        }

        if (subscription.status !== "active") {
            throw new ApiError(
                400,
                "Subscription is not active. Please upgrade again.",
            );
        }

        if (!subscription.cancelScheduled) {
            throw new ApiError(
                400,
                "Subscription is not scheduled for cancellation.",
            );
        }

        await razorpay.subscriptions.cancel(subscription.subscriptionId, 0);

        return res
            .status(200)
            .json(new ApiResponse("Subscription resumed successfully", {}));
    },
);
