import { Document, Types } from "mongoose";

export interface IUrlRef {
    source: string;
    clicks: number;
    createdAt: Date;
}

export interface IUrl extends Document {
    shortCode: string;
    originalUrl: string;
    owner: Types.ObjectId;
    clicks: number;
    qrGenerated: boolean;
    qrGeneratedAt?: Date;
    isActive: boolean;
    createdAt: string;
    refs: IUrlRef[];
    groupId: Types.ObjectId;
}

export interface UrlQuery {
    owner: Types.ObjectId;
    $or?: [
        { originalUrl: { $regex: string; $options: string } },
        { shortCode: { $regex: string; $options: string } }
    ];
    groupId?: Types.ObjectId;
}
