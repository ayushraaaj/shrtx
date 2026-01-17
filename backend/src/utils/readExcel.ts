import ExcelJs from "exceljs";
import { ApiError } from "./ApiError";

export const readExcel = async (filePath: string) => {
    const workbook = new ExcelJs.Workbook();

    try {
        await workbook.xlsx.readFile(filePath);
    } catch (error) {
        throw new ApiError(400, "Invalid Excel file");
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
        throw new ApiError(400, "Excel file contains no worksheets");
    }

    const rows: string[] = [];

    worksheet.eachRow((row) => {
        const values: string[] = [];

        row.eachCell((cell) => {
            if (cell.value !== null) {
                values.push(String(cell.value));
            }
        });

        if (values.length > 0) {
            rows.push(values.join(" "));
        }
    });

    return rows;
};
