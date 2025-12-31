export interface UrlApiItem {
    _id: string;
    shortCode: string;
    originalUrl: string;
    owner: string;
    clicks: number;
    qrGenerated: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    qrGeneratedAt: string;
    shortUrl: string;
    isActive: boolean
}