import { BACKEND_URL } from "../config/env";

export const isShortUrl = (url: string) => {
    return url.includes(BACKEND_URL);
};

export const filterLongUrls = (urls: string[]) => {
    return urls.filter((url) => !isShortUrl(url));
};
