export interface UrlRef {
    source: string;
    clicks: number;
    // [key: string]: string | number;
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
    refs: UrlRef[];
}

export interface AllUrlAnalytics {
    totalUrls: number;
    activeUrls: number;
    totalClicks: number;
    refs: UrlRef[];
}

export interface UrlDetails {
    _id: string;
    shortCode: string;
    originalUrl: string;
    clicks: number;
    qrGenerated: boolean;
    isActive: boolean;
    refs: UrlRef[];
    groupId: string | null;
    expiration: Date | null;
    limit: number | null;
    notes: string | null;
    password: string | null;
    createdAt: string;
    shortUrl: string;
    groupName: string | null;
}
