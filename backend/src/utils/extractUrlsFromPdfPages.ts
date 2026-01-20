export const extractUrlsFromPages = (pages: string[]) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;

    const matchedUrls = pages.map((page, index) => {
        const matches = page.match(urlRegex) || [];

        return {
            pageIndex: index,
            urls: matches,
        };
    });

    return matchedUrls;
};
