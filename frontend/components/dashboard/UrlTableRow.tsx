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
        <tr className="group border-b border-zinc-50 hover:bg-zinc-50/80 transition-all duration-200">
            <td className="px-6 py-4 max-w-[320px]">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-zinc-200 p-1.5 shadow-sm">
                        <img
                            src={`https://www.google.com/s2/favicons?sz=64&domain=${url.originalUrl}`}
                            alt="site icon"
                            className="w-full h-full object-contain opacity-70"
                        />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                            {url.originalUrl.replace(/(^\w+:|^)\/\//, "")}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-medium truncate uppercase tracking-tight">
                            Destination
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-3 justify-center">
                    <Link
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline decoration-2 underline-offset-4 transition-colors"
                    >
                        {url.shortUrl.replace("https://", "")}
                    </Link>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton shortUrl={url.shortUrl} />
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 flex justify-center items-center">
                <GeneratingQR
                    shortUrl={url.shortUrl}
                    qrGenerated={url.qrGenerated}
                />
            </td>

            <td className="px-6 py-4 text-center">
                <div className="inline-flex flex-col items-end">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-900 text-white shadow-sm">
                        {url.clicks.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-tighter">
                        Total Clicks
                    </span>
                </div>
            </td>
        </tr>
    );
};

export default UrlTableRow;