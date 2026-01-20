import PDFDocument from "pdfkit";
import fs from "fs";

export const writePDF = (
    outputPath: string,
    pages: string[],
    urlMap: Map<string, string>,
) => {
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    pages.forEach((page, index) => {
        if (index !== 0) {
            doc.addPage();
        }

        doc.fontSize(10).text(page, { width: 500, align: "left" });
    });

    if (urlMap.size > 0) {
        doc.addPage();

        doc.fontSize(14).text("Short URL Mapping", { underline: true });

        doc.moveDown();

        urlMap.forEach((shortUrl, originalUrl) => {
            doc.fontSize(10)
                .text(`Original URL: ${originalUrl}`)
                .text(`Short URL: ${shortUrl}`)
                .moveDown();
        });
    }

    doc.end();
};
