import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import razorpay from "../config/razorpay";
import { ApiResponse } from "../utils/ApiResponse";
import crypto from "crypto";
import { RAZORPAY_KEY_SECRET } from "../config/env";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
    });

    return res.json(order);
});

export const verifyPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        console.log(razorpay_order_id);
        console.log(razorpay_payment_id);
        console.log(razorpay_signature);

        const expected = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        res.json({ success: expected === razorpay_signature });
    },
);
