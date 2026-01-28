import { PDFDocument } from "pdf-lib";
import fs from "fs";

export const loadPDF = async (filePath: string) => {
    const pdfBytes = fs.readFileSync(filePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    console.log("File loaded successfully");

    const modifiedPdfBytes = await pdfDoc.save();

    return modifiedPdfBytes;

    return pdfDoc;
};
