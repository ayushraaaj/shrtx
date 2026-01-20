// "use client";
// import { UrlApiItem } from "@/app/interfaces/url";
// import Link from "next/link";
// import GeneratingQR from "./GeneratingQR";
// import CopyButton from "./CopyButton";
// import { TrashIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation";

// interface Props {
//     url: UrlApiItem;
//     onToggleStatus(urlId: string): void;
//     onDeleteUrl(urlId: string): void;
//     expandedUrl: string;
//     onToggleExpandRow(): void;
// }

// const UrlTableRow = (props: Props) => {
//     const { url, onToggleStatus, onDeleteUrl, expandedUrl, onToggleExpandRow } =
//         props;
//     const isExpanded = expandedUrl === url._id;

//     const router = useRouter();

//     const analyticsForUrl = (urlId: string) => {
//         router.push(`/dashboard/analytics/${urlId}`);
//     };

//     return (
//         <>
//             <tr
//                 className={`group border-b border-zinc-50 hover:bg-zinc-50/80 transition-all duration-200 ${
//                     isExpanded ? "bg-zinc-50/50" : ""
//                 }`}
//             >
//                 <td
//                     className="pl-6 py-4 w-12 cursor-pointer"
//                     onClick={onToggleExpandRow}
//                 >
//                     <ChevronRightIcon
//                         className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
//                             isExpanded ? "rotate-90 text-blue-600" : ""
//                         }`}
//                     />
//                 </td>

//                 <td className="px-6 py-4 min-w-[280px]">
//                     <div className="flex items-center gap-3">
//                         <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-white border border-zinc-200 p-1.5 shadow-sm">
//                             <img
//                                 src={`https://www.google.com/s2/favicons?sz=64&domain=${url.originalUrl}`}
//                                 alt="favicon"
//                                 className="w-full h-full object-contain opacity-80"
//                             />
//                         </div>
//                         <div className="flex flex-col overflow-hidden">
//                             <span className="text-sm font-bold text-zinc-800 truncate max-w-[200px]">
//                                 {url.originalUrl.replace(/(^\w+:|^)\/\//, "")}
//                             </span>
//                             <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
//                                 Source Link
//                             </span>
//                         </div>
//                     </div>
//                 </td>

//                 <td className="px-6 py-4 text-center min-w-[200px]">
//                     <div className="flex items-center justify-center gap-2">
//                         <Link
//                             href={url.shortUrl}
//                             target="_blank"
//                             className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
//                         >
//                             {url.shortUrl.replace("https://", "")}
//                         </Link>
//                         <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                             <CopyButton shortUrl={url.shortUrl} />
//                         </div>
//                     </div>
//                 </td>

//                 <td className="px-6 py-4 text-center w-32">
//                     <div className="flex justify-center">
//                         <GeneratingQR
//                             shortUrl={url.shortUrl}
//                             qrGenerated={url.qrGenerated}
//                         />
//                     </div>
//                 </td>

//                 <td className="px-6 py-4 text-center w-32">
//                     <div className="inline-flex flex-col items-center">
//                         <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
//                             {url.clicks}
//                         </span>
//                         <span className="text-[9px] font-bold text-zinc-400 mt-1 uppercase">
//                             Total Clicks
//                         </span>
//                     </div>
//                 </td>

//                 <td className="px-6 py-4 text-center w-32">
//                     <div className="flex justify-center">
//                         <label className="relative inline-flex items-center cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={url.isActive}
//                                 onChange={() => onToggleStatus(url._id)}
//                             />
//                             <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
//                         </label>
//                     </div>
//                 </td>

//                 <td className="px-6 py-4 text-center w-24">
//                     <button
//                         onClick={() => onDeleteUrl(url._id)}
//                         className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                     >
//                         <TrashIcon className="w-5 h-5" />
//                     </button>
//                 </td>
//             </tr>

//             {isExpanded && (
//                 <tr className="bg-zinc-50/50">
//                     <td colSpan={7} className="px-8 pb-6 pt-2">
//                         <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden max-w-4xl">
//                             <div className="px-4 py-2 border-b border-zinc-100 bg-zinc-50/50">
//                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
//                                     Referral Sources Breakdown
//                                 </span>
//                             </div>

//                             <div className="divide-y divide-zinc-50">
//                                 {url.refs.map((ref) => {
//                                     const refUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${url.shortCode}?ref=${ref.source}`;
//                                     return (
//                                         <div
//                                             key={ref.source}
//                                             className="grid grid-cols-12 items-center px-5 py-3 hover:bg-zinc-50/50 transition-colors"
//                                         >
//                                             <div className="col-span-7 flex flex-col">
//                                                 <span className="text-xs font-bold text-zinc-700">
//                                                     {ref.source}
//                                                 </span>

//                                                 <span className="text-[10px] truncate pr-4">
//                                                     <Link
//                                                         className="text-blue-600 hover:text-blue-700"
//                                                         target="_blank"
//                                                         href={refUrl}
//                                                     >
//                                                         {refUrl}
//                                                     </Link>
//                                                 </span>
//                                                 {/* <span>
//                                                     <GeneratingQR
//                                                         shortUrl={refUrl}
//                                                         qrGenerated={
//                                                             url.qrGenerated
//                                                         }
//                                                     />
//                                                 </span> */}
//                                             </div>

//                                             {/* <div className="">

//                                                 </div> */}

//                                             <div className="col-span-2 flex flex-col items-start">
//                                                 <span className="text-xs font-bold text-zinc-900">
//                                                     {ref.clicks}
//                                                 </span>
//                                                 <span className="text-[9px] font-bold text-zinc-400 uppercase">
//                                                     Clicks
//                                                 </span>
//                                             </div>

//                                             <div className="col-span-3 flex justify-end">
//                                                 <button
//                                                     onClick={() =>
//                                                         navigator.clipboard.writeText(
//                                                             refUrl
//                                                         )
//                                                     }
//                                                     className="px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold rounded-lg hover:bg-zinc-800 transition-all active:scale-95"
//                                                 >
//                                                     Copy Link
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </td>
//                     <td>
//                         <button onClick={() => analyticsForUrl(url._id)}>
//                             Detailed analytics
//                         </button>
//                     </td>
//                 </tr>
//             )}
//         </>
//     );
// };

// export default UrlTableRow;

"use client";
import { UrlApiItem } from "@/app/interfaces/url";
import Link from "next/link";
import GeneratingQR from "./GeneratingQR";
import CopyButton from "./CopyButton";
import {
    TrashIcon,
    ChevronRightIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Props {
    url: UrlApiItem;
    onToggleStatus(urlId: string): void;
    onDeleteUrl(urlId: string): void;
    expandedUrl: string;
    onToggleExpandRow(): void;
    isBulkAddMode: boolean;
    isBulkRemoveMode: boolean;
    selectedUrlIds: string[];
    onToggleSelectUrl(urlId: string): void;
}

const UrlTableRow = (props: Props) => {
    const {
        url,
        onToggleStatus,
        onDeleteUrl,
        expandedUrl,
        onToggleExpandRow,
        isBulkAddMode,
        isBulkRemoveMode,
        selectedUrlIds,
        onToggleSelectUrl,
    } = props;

    const isExpanded = expandedUrl === url._id;

    const router = useRouter();

    const analyticsForUrl = (urlId: string) => {
        router.push(`/dashboard/analytics/url/${urlId}`);
    };

    const handleChange = () => {
        onToggleSelectUrl(url._id);
    };

    return (
        <>
            <tr
                className={`group border-b border-zinc-50 hover:bg-zinc-50/80 transition-all duration-200 ${
                    isExpanded ? "bg-zinc-50/50" : ""
                }`}
            >
                {isBulkAddMode || isBulkRemoveMode ? (
                    <td className="pl-6 py-4 w-12">
                        <input
                            checked={selectedUrlIds.includes(url._id)}
                            onChange={handleChange}
                            type="checkbox"
                        />
                    </td>
                ) : (
                    <td
                        className="pl-6 py-4 w-12 cursor-pointer"
                        onClick={onToggleExpandRow}
                    >
                        <ChevronRightIcon
                            className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                                isExpanded ? "rotate-90 text-blue-600" : ""
                            }`}
                        />
                    </td>
                )}

                <td className="px-6 py-4 min-w-[280px]">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-white border border-zinc-200 p-1.5 shadow-sm">
                            <img
                                src={`https://www.google.com/s2/favicons?sz=64&domain=${url.originalUrl}`}
                                alt="favicon"
                                className="w-full h-full object-contain opacity-80"
                            />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-zinc-800 truncate max-w-[200px]">
                                {url.originalUrl.replace(/(^\w+:|^)\/\//, "")}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                                Source Link
                            </span>
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4 text-center min-w-[200px]">
                    <div className="flex items-center justify-center gap-2">
                        <Link
                            href={url.shortUrl}
                            target="_blank"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            {url.shortUrl.replace("https://", "")}
                        </Link>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <CopyButton shortUrl={url.shortUrl} />
                        </div>
                    </div>
                </td>

                <td className="px-6 py-4 text-center w-32">
                    <div className="flex justify-center">
                        <GeneratingQR
                            shortUrl={url.shortUrl}
                            qrGenerated={url.qrGenerated}
                        />
                    </div>
                </td>

                <td className="px-6 py-4 text-center w-32">
                    <div className="inline-flex flex-col items-center">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                            {url.clicks}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 mt-1 uppercase">
                            Total Clicks
                        </span>
                    </div>
                </td>

                <td className="px-6 py-4 text-center w-32">
                    <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={url.isActive}
                                onChange={() => onToggleStatus(url._id)}
                            />
                            <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </td>

                <td className="px-6 py-4 text-center w-24">
                    <button
                        onClick={() => onDeleteUrl(url._id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </td>
            </tr>

            {isExpanded && (
                <tr className="bg-zinc-50/50">
                    <td colSpan={7} className="px-8 pb-6 pt-2">
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden max-w-4xl">
                            <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Referral Sources Breakdown
                                </span>
                                <button
                                    onClick={() => analyticsForUrl(url._id)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-bold hover:bg-blue-100 transition-all active:scale-95 border border-blue-100"
                                >
                                    <ChartBarIcon className="w-3.5 h-3.5" />
                                    View Detailed Analytics
                                </button>
                            </div>

                            <div className="divide-y divide-zinc-50">
                                {url.refs.map((ref) => {
                                    const refUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${url.shortCode}?ref=${ref.source}`;
                                    return (
                                        <div
                                            key={ref.source}
                                            className="grid grid-cols-12 items-center px-5 py-3 hover:bg-zinc-50/50 transition-colors"
                                        >
                                            <div className="col-span-7 flex flex-col">
                                                <span className="text-xs font-bold text-zinc-700">
                                                    {ref.source}
                                                </span>
                                                <span className="text-[10px] truncate pr-4 text-zinc-400">
                                                    <Link
                                                        href={refUrl}
                                                        target="_blank"
                                                    >
                                                        {refUrl.replace(
                                                            /(^\w+:|^)\/\//,
                                                            "",
                                                        )}
                                                    </Link>
                                                </span>
                                            </div>

                                            <div className="col-span-2 flex flex-col items-start">
                                                <span className="text-xs font-bold text-zinc-900">
                                                    {ref.clicks}
                                                </span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase">
                                                    Clicks
                                                </span>
                                            </div>

                                            <div className="col-span-3 flex justify-end">
                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            refUrl,
                                                        )
                                                    }
                                                    className="px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold rounded-lg hover:bg-zinc-800 transition-all active:scale-95"
                                                >
                                                    Copy Link
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default UrlTableRow;
