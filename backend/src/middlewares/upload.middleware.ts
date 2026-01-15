import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${file.originalname}_${Date.now()}_${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    },
});

const file_Filter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new ApiError(400, "Only .xlsx files are allowed"));
    }

    cb(null, true);
};

export const uploadExcel = multer({
    storage,
    fileFilter: file_Filter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
