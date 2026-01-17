import { Types } from "mongoose";
import { Url } from "../models/url.model";
import { BACKEND_URL } from "../config/env";
import crypto from "crypto";

export const bulkShortenUrls = async (
    userId: Types.ObjectId,
    urls: string[]
) => {
    const results = [];

    for (const originalUrl of urls) {
        const existingUrl = await Url.findOne({ originalUrl, owner: userId });

        if (existingUrl) {
            results.push({
                originalUrl,
                shortUrl: `${BACKEND_URL}/${existingUrl.shortCode}`,
            });

            continue;
        }

        const shortCode = crypto.randomBytes(3).toString("hex").substring(0, 5);

        const REF_SOURCES = ["instagram", "facebook", "twitter", "whatsapp"];

        const refs = REF_SOURCES.map((source) => ({
            source,
            clicks: 0,
            createdAt: new Date(),
        }));

        const response = await Url.create({
            shortCode: shortCode,
            originalUrl: originalUrl,
            owner: userId,
            refs,
        });

        results.push({
            originalUrl,
            shortUrl: `${BACKEND_URL}/${response.shortCode}`,
        });
    }

    return results;
};

// try {
//     shortUrl = await createShortUrl(originalUrl, req.user!._id);
// } catch (error: any) {
//     // URL already exists → reuse
//     if (error.statusCode === 409) {
//         const existing = await Url.findOne({
//             originalUrl,
//             owner: req.user!._id,
//         });

//         if (!existing) {
//             throw error; // defensive, should not happen
//         }

//         shortUrl = `${process.env.BACKEND_URL}/${existing.shortCode}`;
//     } else {
//         throw error; // real error → stop
//     }
// }

// results.push({ originalUrl, shortUrl });
