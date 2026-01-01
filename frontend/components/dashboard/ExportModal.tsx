"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    showExportModal: boolean;
    onCloseModal: () => void;
}

const ExportModal = (props: Props) => {
    const router = useRouter();

    const { showExportModal, onCloseModal } = props;

    const [exportOption, setExportOption] = useState("10");
    const [customValue, setCustomValue] = useState("");
    const [fileType, setFileType] = useState("csv");

    if (!showExportModal) return;

    const handleExport = () => {
        let limit = exportOption;

        if (exportOption === "custom") {
            if (!customValue || Number(customValue) <= 0) {
                alert("Please enter a valid number");
                return;
            }
            limit = customValue;
        }

        const timestamp = Date.now();

        // window.location.href = `/url/export?limit=${limit}&type=${fileType}`;
        router.push(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/url/export?limit=${limit}&type=${fileType}&t=${timestamp}`
        );

        onCloseModal();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Export URLs</h2>

                <select
                    value={exportOption}
                    onChange={(e) => setExportOption(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                >
                    <option value="10">Last 10 URLs</option>
                    <option value="20">Last 20 URLs</option>
                    <option value="all">All URLs</option>
                    <option value="custom">Custom</option>
                </select>

                {exportOption === "custom" && (
                    <input
                        type="number"
                        placeholder="Enter number"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        className="w-full border rounded p-2 mb-4"
                    />
                )}

                <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                >
                    <option value="csv">CSV (.csv)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCloseModal}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
