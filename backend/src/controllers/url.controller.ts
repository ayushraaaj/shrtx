import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import crypto from "crypto";
import { Url } from "../models/url.model";
import { ApiResponse } from "../utils/ApiResponse";
import { BACKEND_URL, CLIENT_URL } from "../config/env";
import { UrlQuery } from "../interfaces/IUrl";
import ExcelJS from "exceljs";
import QRCode from "qrcode";

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

    const REF_SOURCES = ["instagram", "facebook", "twitter", "whatsapp"];

    const refs = REF_SOURCES.map((source) => ({
        source,
        clicks: 0,
        createdAt: new Date(),
    }));

    const response = await Url.create({
        shortCode: shortCode,
        originalUrl: originalUrl,
        owner: userId,
        refs,
    });

    const shortenedUrl = `${BACKEND_URL}/${shortCode}`;

    return res
        .status(201)
        .json(new ApiResponse("Url shortened successfully", shortenedUrl));
});

export const openShortUrl = asyncHandler(
    async (req: Request, res: Response) => {
        const { shortCode } = req.params;
        const { ref } = req.query;

        const urlDoc = await Url.findOne({ shortCode });
        if (!urlDoc || !urlDoc.isActive) {
            return res.redirect(`${CLIENT_URL}/404`);
        }

        urlDoc.clicks += 1;

        if (ref) {
            const findRef = urlDoc.refs.find((r) => r.source === ref);

            if (findRef) {
                findRef.clicks += 1;
            }
        }
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

export const exportUrls = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { limit, type } = req.query;

    let query = Url.find({ owner: userId }).sort({ createdAt: -1 });

    if (limit !== "all") {
        const num = Number(limit);
        if (!isNaN(num)) {
            query = query.limit(num);
        }
    }

    const urls = await query.lean();

    // type is CSV

    if (type === "csv") {
        let csv = "Original Url, Short Url, Clicks, Active, Created At\n";

        urls.forEach((url) => {
            csv += `"${url.originalUrl}", "${BACKEND_URL}/${url.shortCode}", "${url.clicks}", "${url.createdAt}"\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=urls-export.csv"
        );

        return res.status(200).send(csv);
    }

    // type is xlsx
    else if (type === "xlsx") {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("URLs");

        sheet.columns = [
            { header: "Original URL", key: "originalUrl", width: 40 },
            { header: "Short URL", key: "shortUrl", width: 30 },
            { header: "QR Code", key: "qrCode", width: 20 },
            { header: "Clicks", key: "clicks", width: 10 },
            { header: "Active", key: "active", width: 10 },
            { header: "Created At", key: "createdAt", width: 20 },
        ];

        let rowIndex = 2;

        for (const url of urls) {
            const shortUrl = `${BACKEND_URL}/${url.shortCode}`;
            sheet.addRow({
                originalUrl: {
                    text: url.originalUrl,
                    hyperlink: url.originalUrl,
                },
                shortUrl: {
                    text: shortUrl,
                    hyperlink: shortUrl,
                },
                clicks: url.clicks,
                active: url.isActive,
                createdAt: url.createdAt,
            });

            if (url.qrGenerated) {
                // Generating QRcode image
                const qrBuffer: any = await QRCode.toBuffer(shortUrl);

                const qrImage = workbook.addImage({
                    buffer: qrBuffer,
                    extension: "png",
                });

                sheet.addImage(qrImage, {
                    tl: { col: 2, row: rowIndex - 1 },
                    ext: { width: 100, height: 100 },
                });

                sheet.getRow(rowIndex).height = 100;
            }

            rowIndex++;
        }

        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: "left", vertical: "middle" };
            });
        });

        sheet.getRow(1).font = { bold: true };

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=urls-export.xlsx"
        );

        await workbook.xlsx.write(res);
        return res.end();
    }

    throw new ApiError(400, "Invalid export type");
});

export const getUrlAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const urlId = req.params.id;

        const urlDoc = await Url.findOne({ _id: urlId, owner: userId }).lean();

        if (!urlDoc) {
            throw new ApiError(404, "URL not found");
        }

        return res
            .status(200)
            .json(new ApiResponse("Fetching successfull", urlDoc));
    }
);

export const getAllUrlAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const urlsDoc = await Url.find({ owner: userId })
            .select("-_id clicks isActive refs.source refs.clicks")
            .lean();

        const totalUrls = urlsDoc.length;
        const activeUrls = urlsDoc.filter((url) => url.isActive).length;

        const totalClicks = urlsDoc.reduce((sum, url) => sum + url.clicks, 0);

        const refsMap: Record<string, number> = {
            instagram: 0,
            facebook: 0,
            twitter: 0,
            whatsapp: 0,
            direct: 0,
        };

        urlsDoc.forEach((url) => {
            url.refs.forEach((ref) => {
                refsMap[ref.source] += ref.clicks;
            });
        });

        const totalRefsClicks = Object.values(refsMap).reduce(
            (sum, clicks) => sum + clicks,
            0
        );

        const directClicks = totalClicks - totalRefsClicks;

        refsMap.direct = directClicks;

        const refsArray = Object.entries(refsMap).map(([source, clicks]) => ({
            source,
            clicks,
        }));

        const response = {
            totalUrls,
            activeUrls,
            totalClicks,
            refs: refsArray,
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    "Overview analytics fetched successfully",
                    response
                )
            );
    }
);
