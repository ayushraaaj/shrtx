"use client";
import React, { useState } from "react";
import { UrlApiItem } from "@/app/interfaces/url";
import UrlTableRow from "./UrlTableRow";

interface Props {
    urls: UrlApiItem[];
    onToggleStatus(urlId: string): void;
    onDeleteUrl(urlId: string): void;
    isBulkAddMode: boolean;
    isBulkRemoveMode: boolean;
    selectedUrlIds: string[];
    setSelectedUrlIds: React.Dispatch<React.SetStateAction<string[]>>;
    isCheckedGlobal: boolean;
    setIsCheckedGlobal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlTable = (props: Props) => {
    const {
        urls,
        onToggleStatus,
        onDeleteUrl,
        isBulkAddMode,
        isBulkRemoveMode,
        selectedUrlIds,
        setSelectedUrlIds,
        isCheckedGlobal,
        setIsCheckedGlobal,
    } = props;

    const [expandedUrl, setExpandedUrl] = useState("");

    const handleToggleExpandRow = (urlId: string) => {
        setExpandedUrl(expandedUrl === urlId ? "" : urlId);
    };

    const handleSelectAll = () => {
        if (isCheckedGlobal) {
            setIsCheckedGlobal(false);
            setSelectedUrlIds([]);
        } else {
            setIsCheckedGlobal(true);
            setSelectedUrlIds(urls.map((url) => url._id));
        }
    };

    const toggleSelectUrl = (urlId: string) => {
        setSelectedUrlIds((prev) => {
            if (prev.includes(urlId)) {
                setIsCheckedGlobal(false);
                return (prev = prev.filter((id) => urlId !== id));
            } else {
                return (prev = [...prev, urlId]);
            }
        });
    };

    return (
        <table className="w-full border-collapse">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
                <tr>
                    <th className="relative px-6 py-4 w-12">
                        {(isBulkAddMode || isBulkRemoveMode) && (
                            <div className="absolute bottom-2">
                                <input
                                    checked={isCheckedGlobal}
                                    onChange={handleSelectAll}
                                    type="checkbox"
                                />
                            </div>
                        )}
                    </th>

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
                        isBulkAddMode={isBulkAddMode}
                        isBulkRemoveMode={isBulkRemoveMode}
                        selectedUrlIds={selectedUrlIds}
                        onToggleSelectUrl={toggleSelectUrl}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default UrlTable;
