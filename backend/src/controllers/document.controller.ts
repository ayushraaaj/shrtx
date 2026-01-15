import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const uploadDocument = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.file) {
            throw new ApiError(400, "File not received");
        }

        return res.status(201).json(
            new ApiResponse("File uploaded successfully", {
                originalName: req.file.originalname,
                storedName: req.file.filename,
                size: req.file.size,
                path: req.file.path,
            })
        );
    }
);
