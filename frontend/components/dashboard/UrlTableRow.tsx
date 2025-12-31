import { UrlApiItem } from "@/app/interfaces/url";
import Link from "next/link";
import GeneratingQR from "./GeneratingQR";
import CopyButton from "./CopyButton";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
    url: UrlApiItem;
    onToggleStatus(urlId: string): void;
    onDeleteUrl(urlId: string): void;
}

const UrlTableRow = (props: Props) => {
    const { url, onToggleStatus, onDeleteUrl } = props;

    return (
        <tr className="group border-b border-zinc-50 hover:bg-zinc-50/80 transition-all duration-200">
            <td className="px-6 py-4 max-w-70">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200 p-1.5 shadow-sm">
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
                        <p className="text-[10px] text-zinc-400 font-bold truncate uppercase tracking-tight">
                            Destination
                        </p>
                    </div>
                </div>
            </td>

            {/* 2. Short URL Column */}
            <td className="px-6 py-4 text-center">
                <div className="flex items-center gap-2 justify-center">
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

            {/* 3. QR Code Column */}
            <td className="px-6 py-4 text-center">
                <div className="flex justify-center items-center">
                    <GeneratingQR
                        shortUrl={url.shortUrl}
                        qrGenerated={url.qrGenerated}
                    />
                </div>
            </td>

            <td className="px-6 py-4 text-center">
                <div className="inline-flex flex-col items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {url.clicks}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400 mt-1 uppercase">
                        Clicks
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-center">
                <div className="flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={url.isActive}
                            onChange={() => onToggleStatus(url._id)}
                        />
                        <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </td>

            <td className="px-6 py-4 text-center">
                <div className="flex justify-center">
                    <button
                        onClick={() => onDeleteUrl(url._id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        title="Delete Link"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default UrlTableRow;
