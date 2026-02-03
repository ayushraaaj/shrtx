import { Request, Response } from "express";
import { IUrl } from "../interfaces/IUrl";

export const handleRedirect = async (
    req: Request,
    res: Response,
    urlDoc: IUrl,
    ref?: string | undefined,
) => {
    urlDoc.clicks += 1;
    if (urlDoc.limit !== null) {
        urlDoc.limit -= 1;
    }

    if (ref) {
        const findRef = urlDoc.refs.find((r) => r.source === ref);

        if (findRef) {
            findRef.clicks += 1;
        }
    }

    await urlDoc.save({ validateBeforeSave: false });
};
