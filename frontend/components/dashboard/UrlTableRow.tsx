import { UrlApiItem } from "@/app/interfaces/url";
import Link from "next/link";
import GeneratingQR from "./GeneratingQR";
import CopyButton from "./CopyButton";

interface Props {
    url: UrlApiItem;
}

const UrlTableRow = (props: Props) => {
    const { url } = props;

    return (
        <tr className="border-t hover:bg-gray-50">
            <td className="p-3 max-w-xs truncate">{url.originalUrl}</td>

            <td className="p-3">
                <Link
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {url.shortUrl}
                </Link>
                <CopyButton shortUrl={url.shortUrl} />
            </td>

            <td className="p-3">
                <GeneratingQR
                    shortUrl={url.shortUrl}
                    qrGenerated={url.qrGenerated}
                />
            </td>

            <td className="p-3 text-right">{url.clicks}</td>
        </tr>
    );
};

export default UrlTableRow;
