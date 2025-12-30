import { Document, Types } from "mongoose";

export interface IUrl extends Document {
    shortCode: string;
    originalUrl: string;
    owner: Types.ObjectId;
    clicks: number;
    qrGenerated: boolean;
    qrGeneratedAt?: Date;
}

export interface UrlQuery {
    owner: Types.ObjectId;
    $or?: [
        { originalUrl: { $regex: string; $options: string } },
        { shortCode: { $regex: string; $options: string } }
    ];
}
