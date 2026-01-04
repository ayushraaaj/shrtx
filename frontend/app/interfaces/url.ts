export interface UrlRef {
    source: string;
    clicks: number;
    createdAt: string;
    [key: string]: string | number;
}

export interface UrlApiItem {
    _id: string;
    shortCode: string;
    originalUrl: string;
    owner: string;
    clicks: number;
    qrGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    qrGeneratedAt: Date;
    shortUrl: string;
    isActive: boolean;
    refs: UrlRef[];
}

export interface UrlAnalytics {
    shortCode: string;
    originalUrl: string;
    clicks: number;
    qrGenerated: boolean;
    isActive: boolean;
    refs: UrlRef[];
    createdAt: Date;
    qrGeneratedAt: Date;
}

export interface AllUrlAnalytics {
    totalUrls: number;
    activeUrls: number;
    totalClicks: number;
    refs: UrlRef[];
}
