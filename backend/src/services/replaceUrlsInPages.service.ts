export const buildUrlMap = async (
    pagesWithUrls: { pageIndex: number; urls: string[] }[],
    getOrCreateShortUrl: (url: string) => Promise<string>,
) => {
    const urlMap = new Map<string, string>();

    for (const page of pagesWithUrls) {
        for (const url of page.urls) {
            if (!urlMap.has(url)) {
                const shortUrl = await getOrCreateShortUrl(url);
                urlMap.set(url, shortUrl);
            }
        }
    }

    return urlMap;
};

export const replaceUrlsInPages = (
    pages: string[],
    urlMap: Map<string, string>,
) => {
    const newPages = pages.map((page) => {
        let newPage = page;

        urlMap.forEach((shortUrl, originalUrl) => {
            newPage = newPage.split(originalUrl).join(shortUrl);
        });

        return newPage;
    });

    return newPages;
};
