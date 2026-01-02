import { body } from "express-validator";

export const shortUrlValidator = () => {
    return [
        body("originalUrl").trim().notEmpty().withMessage("Url is required"),
    ];
};
