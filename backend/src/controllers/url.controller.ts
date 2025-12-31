import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import crypto from "crypto";
import { Url } from "../models/url.model";
import { ApiResponse } from "../utils/ApiResponse";
import { BACKEND_URL, CLIENT_URL } from "../config/env";
import { UrlQuery } from "../interfaces/IUrl";

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
    // console.log(originalUrl);
    const userId = req.user?._id;

    if (!isValidUrl(originalUrl)) {
        throw new ApiError(400, "Please enter a valid url");
    }

    const existingUrl = await Url.findOne({ originalUrl, owner: userId });
    if (existingUrl) {
        throw new ApiError(409, "URL already shortened");
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
        if (!urlDoc || !urlDoc.isActive) {
            return res.redirect(`${CLIENT_URL}/404`);
        }

        // if (!urlDoc.isActive) {
        //     throw new ApiError(400, "Unauthorized");
        // }

        urlDoc.clicks += 1;
        urlDoc.save({ validateBeforeSave: false });

        return res.redirect(urlDoc.originalUrl);
    }
);

export const generateQR = asyncHandler(async (req: Request, res: Response) => {
    const { shortUrl } = req.body;
    const userId = req.user?._id;

    const shortCode = shortUrl.split("/").pop();

    const urlDoc = await Url.findOne({ shortCode, owner: userId });

    if (!urlDoc) {
        throw new ApiError(404, "URL not found");
    }

    urlDoc.qrGenerated = true;
    urlDoc.qrGeneratedAt = new Date();
    await urlDoc.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse("QR generated successfully", {}));
});

export const getAllUrlDetails = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const search = (req.query.search as string) || undefined;

        const query: UrlQuery = { owner: userId };

        if (search) {
            query.$or = [
                { originalUrl: { $regex: search, $options: "i" } },
                { shortCode: { $regex: search, $options: "i" } },
            ];
        }

        const urls = await Url.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalUrls = await Url.countDocuments({ owner: userId });

        const urlsData = {
            urls: urls.map((url) => ({
                ...url,
                shortUrl: `${BACKEND_URL}/${url.shortCode}`,
            })),
            pagination: {
                currentPage: page,
                limit,
                totalUrls,
                totalPages: Math.ceil(totalUrls / limit),
            },
        };

        return res
            .status(200)
            .json(new ApiResponse("URLs fetched successfully", urlsData));
    }
);

export const toggleUrlStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const urlId = req.params.id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const urlDoc = await Url.findOne({ _id: urlId, owner: userId });
        if (!urlDoc) {
            throw new ApiError(404, "URL not found");
        }

        urlDoc.isActive = !urlDoc.isActive;
        urlDoc.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(
                new ApiResponse("Status updated", { isActive: urlDoc.isActive })
            );
    }
);

export const deleteUrl = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const urlId = req.params.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const deletedUrl = await Url.findOneAndDelete({
        _id: urlId,
        owner: userId,
    });
    if (!deletedUrl) {
        throw new ApiError(404, "URL not found");
    }

    return res.status(200).json(new ApiResponse("Deleted successfully", {}));
});
