import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { readExcel } from "../utils/readExcel";
import { exportUrlsFromRows } from "../utils/extractUrlsFromRows";
import { bulkShortenUrls } from "../services/bulkShorten.service";
import ExcelJs from "exceljs";
import fs from "fs";
import { loadPDF } from "../utils/loadPdf";
import { extractPageText } from "../services/pdfTextExtractor.service";
import { extractUrlsFromPage } from "../services/pdfUrlExtractor";
import { addLinkAnnotation } from "../services/pdfAnnotation.service";

export const uploadDocument = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        if (!req.file) {
            throw new ApiError(400, "File not received");
        }

        const {
            path: filePath,
            mimetype,
            originalname: originalName,
        } = req.file;

        if (mimetype === "application/pdf") {
            const modifiedPdfBytes: any = await addLinkAnnotation(filePath);
            fs.writeFileSync("test-output.pdf", modifiedPdfBytes);

            // const pagesText = await extractPageText(filePath);
            // console.log("hello");
            // for (const pageText of pagesText) {
            //     const urls = extractUrlsFromPage(pageText);
            //     console.log("Extracted URLs:", urls);
            // }
        } else if (
            mimetype ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            mimetype === "application/vnd.ms-excel"
        ) {
            const rows = await readExcel(req.file.path);
            const urls = exportUrlsFromRows(rows);
            const results = await bulkShortenUrls(userId, urls);

            // console.log(results);

            const workbook = new ExcelJs.Workbook();
            await workbook.xlsx.readFile(req.file.path);

            const worksheet = workbook.worksheets[0];

            const urlMap = new Map<string, string>();
            results.forEach((url) => {
                urlMap.set(url.originalUrl, url.shortUrl);
            });

            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    if (
                        typeof cell.value === "string" &&
                        urlMap.has(cell.value)
                    ) {
                        cell.value = urlMap.get(cell.value);

                        const column = worksheet.getColumn(cell.col);
                        column.width = 30;
                    }
                });
            });

            let mappingSheet = workbook.getWorksheet("Short URL Mapping");

            if (mappingSheet) {
                mappingSheet.spliceRows(2, mappingSheet.rowCount);
            } else {
                mappingSheet = workbook.addWorksheet("Short URL Mapping");

                mappingSheet.columns = [
                    { header: "Original URL", key: "originalUrl", width: 50 },
                    { header: "Short URL", key: "shortUrl", width: 30 },
                ];
            }

            results.forEach((url) => mappingSheet.addRow(url));

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            );

            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${req.file.filename}`,
            );

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
    },
);
