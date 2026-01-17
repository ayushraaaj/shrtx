export const exportUrlsFromRows = (rows: string[]) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;

    const urls = [];
    const visited = new Set<string>();

    for (const row of rows) {
        const matches = row.match(urlRegex);
        if (!matches) {
            continue;
        }

        for (const url of matches) {
            if (!visited.has(url)) {
                visited.add(url);
                urls.push(url);
            }
        }
    }

    return urls;
};
