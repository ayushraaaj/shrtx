import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import crypto from "crypto";
import { Url } from "../models/url.model";
import { ApiResponse } from "../utils/ApiResponse";
import { BACKEND_URL, CLIENT_URL } from "../config/env";

const isValidUrl = (url: string) => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (error) {
        return false;
    }
};

export const shortUrl = asyncHandler(async (req: Request, res: Response) => {
    const { originalUrl } = req.body;
    console.log(originalUrl);
    const userId = req.user?._id;

    if (!isValidUrl(originalUrl)) {
        throw new ApiError(400, "Please enter a valid url");
    }

    const shortCode = crypto.randomBytes(3).toString("hex").substring(0, 5);

    const response = await Url.create({
        shortCode: shortCode,
        originalUrl: originalUrl,
        owner: userId,
    });

    const shortenedUrl = `${BACKEND_URL}/${shortCode}`;

    return res
        .status(201)
        .json(new ApiResponse("Url shortened successfully", shortenedUrl));
});

export const openShortUrl = asyncHandler(
    async (req: Request, res: Response) => {
        const { shortCode } = req.params;

        const urlDoc = await Url.findOne({ shortCode });
        if (!urlDoc) {
            return res.redirect(`${CLIENT_URL}/404`)
        }

        urlDoc.clicks += 1;
        urlDoc.save({ validateBeforeSave: false });

        return res.redirect(urlDoc.originalUrl);
    }
);
