import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let apiError;
    if (err instanceof ApiError) {
        apiError = err;
    } else {
        const statusCode = err instanceof mongoose.Error ? 400 : 500;
        const message = err.message || "Something went wrong";

        apiError = new ApiError(statusCode, message);
    }

    const response = {
        success: false,
        message: apiError.message,
        data: null,
        errors: apiError.errors,
        ...(process.env.NODE_ENV === "development" && {
            stack: apiError.stack,
        }),
    };

    return res.status(apiError.statusCode).json(response);
};
