import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";

export const healthcheck = (req: Request, res: Response) => {
    return res
        .status(200)
        .json(new ApiResponse("OK", "Server is running fine"));
};
