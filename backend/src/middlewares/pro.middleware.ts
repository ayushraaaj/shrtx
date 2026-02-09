import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Subscription } from "../models/subscription.model";
import { ApiError } from "../utils/ApiError";

export const requirePro = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?._id;

        const subscription = await Subscription.findOne({
            userId,
            status: "active",
        });

        if (!subscription) {
            throw new ApiError(403, "Upgrade to PRO");
        }

        next();
    },
);
