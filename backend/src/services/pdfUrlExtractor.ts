export const extractUrlsFromPage = (pageText: string) => {
    const URL_START_REGEX = /https?:\/\//g;

    const lines = pageText.split("\n");

    const urls = [];
    let url = "";

    for (const line of lines) {
        const trimmed = line.trim();

        const matches = [...trimmed.matchAll(URL_START_REGEX)];

        if (matches.length > 0) {
            for (let i = 0; i < matches.length; i++) {
                const startIndex = matches[i].index;
                const endIndex =
                    i + 1 < matches.length
                        ? matches[i + 1].index
                        : trimmed.length;

                const oneUrl = trimmed.slice(startIndex, endIndex);

                if (url) {
                    urls.push(url);
                    url = "";
                }

                url = oneUrl;
            }
        } else if (url) {
            if (trimmed && trimmed.includes(" ")) {
                urls.push(url);
                url = "";
                continue;
            }

            url += trimmed;
        }
    }

    if (url) {
        urls.push(url);
    }

    return urls;
};
