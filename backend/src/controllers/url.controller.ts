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
import { Types } from "mongoose";
import PDFDocument from "pdfkit";
import { Group } from "../models/group.model";

const isValidUrl = (url: string) => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (error) {
        return false;
    }
};

export const shortUrl = asyncHandler(async (req: Request, res: Response) => {
    const { originalUrl, customName } = req.body;
    const userId = req.user?._id;

    if (!isValidUrl(originalUrl)) {
        throw new ApiError(400, "Please enter a valid url");
    }

    const existingUrl = await Url.exists({ originalUrl, owner: userId });
    if (existingUrl) {
        throw new ApiError(409, "URL already shortened");
    }

    const RESERVED_WORDS = [
        "dashboard",
        "analytics",
        "group",
        "login",
        "signup",
        "api",
    ];

    let shortCode: string;
    if (customName) {
        shortCode = customName.trim().toLowerCase();

        if (!/^[a-z0-9-_]{3,10}$/.test(shortCode)) {
            throw new ApiError(
                400,
                "Custom name must be 3-30 characters and must not have special characters except - and _"
            );
        }

        if (RESERVED_WORDS.includes(shortCode)) {
            throw new ApiError(400, "This custom name is reserved");
        }

        const existingShortCode = await Url.exists({ shortCode });
        if (existingShortCode) {
            throw new ApiError(409, "Custom name already in use");
        }
    } else {
        shortCode = crypto.randomBytes(3).toString("hex").substring(0, 5);
    }

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

        const groupName = req.query.group;

        const page = Number(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const search = (req.query.search as string) || undefined;

        const query: UrlQuery = { owner: userId };

        if (search) {
            query.$or = [
                { originalUrl: { $regex: search, $options: "i" } },
                { shortCode: { $regex: search, $options: "i" } },
            ];
        }

        if (groupName && groupName !== "all") {
            if (groupName === "ungrouped") {
                query.groupId = null;
            } else {
                const groupDoc = await Group.findOne({
                    groupName,
                    owner: userId,
                }).select("_id");

                if (!groupDoc) {
                    throw new ApiError(404, "Group not found");
                }

                query.groupId = groupDoc._id;
            }
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

const getUrlAnalyticsData = async (urlId: string, userId: Types.ObjectId) => {
    const urlDoc = await Url.findOne({ _id: urlId, owner: userId })
        .select("shortCode originalUrl clicks refs.source refs.clicks -_id")
        .lean();

    if (!urlDoc) {
        throw new ApiError(404, "URL not found");
    }

    let refsClick = 0;
    urlDoc.refs.forEach((ref) => {
        refsClick += ref.clicks;
    });

    const directClicks = urlDoc.clicks - refsClick;

    const refs = [...urlDoc.refs, { source: "direct", clicks: directClicks }];

    const response = {
        shortCode: urlDoc.shortCode,
        originalUrl: urlDoc.originalUrl,
        clicks: urlDoc.clicks,
        refs,
    };

    return response;
};

export const getUrlAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const urlId = req.params.id;

        if (!userId) {
            throw new ApiError(404, "Unauthorized");
        }

        const response = await getUrlAnalyticsData(urlId, userId);

        return res
            .status(200)
            .json(new ApiResponse("Fetching successfull", response));
    }
);

export const exportUrlAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const urlId = req.params.id;
        const { charts } = req.body;

        if (!userId) {
            throw new ApiError(404, "Unauthorized");
        }

        const analytics = await getUrlAnalyticsData(urlId, userId);

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=url-analytics-${analytics.shortCode}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(18).text("URL Analytics Report", { align: "center" });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Short URL: ${CLIENT_URL}/${analytics.shortCode}`);
        doc.moveDown(0.5);

        doc.text(`Original URL: ${analytics.originalUrl}`);
        doc.moveDown(0.5);

        doc.text(`Total Clicks: ${analytics.clicks}`);
        doc.moveDown();

        doc.fontSize(14).text("Traffic by Source");
        doc.moveDown(0.5);

        const barChartImage = charts.bar.replace(
            /^data:image\/png;base64,/,
            ""
        );
        doc.image(Buffer.from(barChartImage, "base64"), {
            fit: [500, 250],
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(13).text("Traffix Distribution");
        doc.moveDown(0.5);

        const pieChartImage = charts.pie.replace(
            /^data:image\/png;base64,/,
            ""
        );
        doc.image(Buffer.from(pieChartImage, "base64"), {
            fit: [400, 250],
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(10).text(`Generated on ${new Date()}`, { align: "right" });

        doc.end();
    }
);

export const getAllUrlAnalyticsData = async (
    userId: Types.ObjectId,
    groupId?: Types.ObjectId
) => {
    const query: UrlQuery = {
        owner: userId,
    };

    if (groupId) {
        query.groupId = groupId;
    }

    const urlsDoc = await Url.find(query)
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

    return response;
};

export const getAllUrlAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError(404, "Unauthorized");
        }

        const response = await getAllUrlAnalyticsData(userId);

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

export const exportAllUrlsAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const { charts, heading, groupName } = req.body;

        if (!userId) {
            throw new ApiError(404, "Unauthorized");
        }

        const analytics = await getAllUrlAnalyticsData(userId);

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${heading}_${groupName}.pdf`
        );

        doc.pipe(res);

        let pdfHeading = heading;
        if (groupName) {
            pdfHeading += ` (${groupName})`;
        }

        doc.fontSize(18).text(pdfHeading, { align: "center" });
        doc.moveDown();

        doc.fontSize(12);

        doc.text(`Total URLs: ${analytics.totalUrls}`, { continued: true });

        doc.text(`Active Links: ${analytics.activeUrls}`, 80, doc.y, {
            continued: true,
        });

        doc.text(`Total Clicks: ${analytics.totalClicks}`, 120, doc.y);
        doc.moveDown(1.5);

        doc.fontSize(14).text("Traffic by Source");
        doc.moveDown(0.5);

        const barChartImage = charts.bar.replace(
            /^data:image\/png;base64,/,
            ""
        );
        doc.image(Buffer.from(barChartImage, "base64"), {
            fit: [500, 250],
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(13).text("Traffix Distribution");
        doc.moveDown(0.5);

        const pieChartImage = charts.pie.replace(
            /^data:image\/png;base64,/,
            ""
        );
        doc.image(Buffer.from(pieChartImage, "base64"), {
            fit: [400, 250],
            align: "center",
        });

        doc.moveDown();

        doc.fontSize(10).text(`Generated on ${new Date()}`, { align: "right" });

        doc.end();
    }
);
