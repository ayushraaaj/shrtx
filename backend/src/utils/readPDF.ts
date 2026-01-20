import fs from "fs";
const pdf = require("pdf-parse");

export const readPDF = async (filePath: string) => {
    const buffer = fs.readFileSync(filePath);

    const data = await pdf(buffer);

    const pages = data.text
        .split("\f")
        .map((page: string) => page.trim())
        .filter(Boolean);

    return pages;
};
