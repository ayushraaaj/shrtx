import fs from "fs";
import { PDFDocument } from "pdf-lib";

export const addLinkAnnotation = async (filePath: string) => {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const page = pdfDoc.getPages()[0];

    page.drawText("CLICK HERE", {
        x: 50,
        y: 700,
        size: 20,
        opacity: 1,
        link: "https://google.com",
    } as any);

    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
};
