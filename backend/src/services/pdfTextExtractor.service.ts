import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractPageText = async (filePath: string) => {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjs.getDocument({ data }).promise;

    const totalPages = pdf.numPages;
    const pagesText = [];

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const text = content.items.map((item: any) => item.str).join("\n");

        pagesText.push(text);
    }

    return pagesText;
};
