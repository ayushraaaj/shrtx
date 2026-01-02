"use client";
import { useState } from "react";
import { UrlApiItem } from "@/app/interfaces/url";
import UrlTableRow from "./UrlTableRow";

interface Props {
    urls: UrlApiItem[];
    onToggleStatus(urlId: string): void;
    onDeleteUrl(urlId: string): void;
}

const UrlTable = ({ urls, onToggleStatus, onDeleteUrl }: Props) => {
    const [expandedUrl, setExpandedUrl] = useState("");

    const handleToggleExpandRow = (urlId: string) => {
        setExpandedUrl(expandedUrl === urlId ? "" : urlId);
    };

    return (
        <table className="w-full border-collapse text-left">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                    <th className="pl-6 py-4 w-12"></th>

                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Source Destination
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Shortened URL
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        QR Code
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Engagement
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Status
                    </th>

                    <th className="px-6 py-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
                {urls.map((url) => (
                    <UrlTableRow
                        key={url._id}
                        url={url}
                        onToggleStatus={onToggleStatus}
                        onDeleteUrl={onDeleteUrl}
                        expandedUrl={expandedUrl}
                        onToggleExpandRow={() => handleToggleExpandRow(url._id)}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default UrlTable;
