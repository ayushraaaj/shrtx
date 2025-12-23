import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        try {
            const decodedToken = jwt.verify(
                token,
                ACCESS_TOKEN_SECRET
            ) as JwtPayload;

            const user = await User.findById(decodedToken?._id);
            if (!user) {
                throw new ApiError(401, "Invalid access token");
            }

            req.user = user;
        } catch (error) {
            throw new ApiError(401, "Invalid access token");
        }
        next();
    }
);
