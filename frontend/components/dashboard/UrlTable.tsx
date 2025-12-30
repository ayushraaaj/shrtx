import { UrlApiItem } from "@/app/interfaces/url";
import UrlTableRow from "./UrlTableRow";
import {
    LinkIcon,
    QrCodeIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

interface Props {
    urls: UrlApiItem[];
}

const UrlTable = (props: Props) => {
    const { urls } = props;

    if (urls.length === 0) return null;

    return (
        <div className="relative overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-100 bg-zinc-50/50">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <div className="flex items-center justify-center gap-2">
                                    <LinkIcon className="w-4 h-4" />
                                    Source Destination
                                </div>
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Short URL
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <div className="flex items-center justify-center gap-2">
                                    <QrCodeIcon className="w-4 h-4" />
                                    QR Code
                                </div>
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <div className="flex items-center justify-center gap-2">
                                    <ChartBarIcon className="w-4 h-4" />
                                    Engagement
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100 bg-white">
                        {urls.map((url) => (
                            <UrlTableRow key={url._id} url={url} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UrlTable;
