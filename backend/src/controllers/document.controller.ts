import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { readExcel } from "../utils/readExcel";
import { exportUrlsFromRows } from "../utils/extractUrlsFromRows";
import { bulkShortenUrls } from "../services/bulkShorten.servie";
import ExcelJs from "exceljs";
import fs from "fs";

export const uploadDocument = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!req.file) {
            throw new ApiError(400, "File not received");
        }

        const rows = await readExcel(req.file.path);
        const urls = exportUrlsFromRows(rows);
        const results = await bulkShortenUrls(userId, urls);

        console.log(results);

        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(req.file.path);

        const worksheet = workbook.worksheets[0];

        const urlMap = new Map<string, string>();
        results.forEach((url) => {
            urlMap.set(url.originalUrl, url.shortUrl);
        });

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                if (typeof cell.value === "string" && urlMap.has(cell.value)) {
                    cell.value = urlMap.get(cell.value);

                    const column = worksheet.getColumn(cell.col);
                    column.width = 30;
                }
            });
        });

        const mappingSheet = workbook.addWorksheet("Short URL Mapping");

        mappingSheet.columns = [
            { header: "Original URL", key: "originalUrl", width: 50 },
            { header: "Short URL", key: "shortUrl", width: 30 },
        ];

        results.forEach((url) => mappingSheet.addRow(url));

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${req.file.filename}`
        );

        // return res.status(201).json(
        //     new ApiResponse("File uploaded successfully", {
        //         originalName: req.file.originalname,
        //         storedName: req.file.filename,
        //         size: req.file.size,
        //         path: req.file.path,
        //     })
        // );

        res.on("finish", () => {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log("Failed to delete uploaded file", err);
                    }
                });
            }
        });

        await workbook.xlsx.write(res);
        return res.end();
    }
);
