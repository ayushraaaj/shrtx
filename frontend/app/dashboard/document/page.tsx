// "use client";
// import { api } from "@/lib/axios";
// import axios from "axios";
// import { useState } from "react";

// const Document = () => {
//     const [loading, setLoading] = useState(false);
//     const [response, setResponse] = useState("");
//     const [file, setFile] = useState<File | null>(null);

//     const onUpload = async () => {
//         if (!file) {
//             setResponse("Please select a file");
//             return;
//         }

//         try {
//             setLoading(true);

//             const formData = new FormData();
//             formData.append("file", file);

//             const res = await api.post("/document/upload", formData, {
//                 responseType: "blob",
//             });

//             const blob = new Blob([res.data]);
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `processed_${file.name}`;
//             a.click();

//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 setResponse(error.response?.data.message ?? "Upload failed");
//             } else {
//                 setResponse("Unexpected error");
//             }
//         } finally {
//             setLoading(false);
//             setFile(null);
//         }
//     };

//     return (
//         <div>
//             <h1>Document Processing</h1>
//             <input
//                 disabled={loading}
//                 type="file"
//                 onChange={(e) => setFile(e.target.files?.[0] || null)}
//             />
//             <button onClick={onUpload} disabled={loading}>
//                 {loading ? "Processing" : "Upload & Process"}{" "}
//             </button>

//             {response && <p>{response}</p>}
//         </div>
//     );
// };

// export default Document;

"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import { useState, useRef } from "react";
import {
    CloudArrowUpIcon,
    DocumentIcon,
    XMarkIcon,
    CheckCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Document = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ message: "", type: "" });
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onUpload = async () => {
        if (!file) {
            setResponse({
                message: "Please select a file first",
                type: "error",
            });
            return;
        }

        try {
            setLoading(true);
            setResponse({ message: "", type: "" });

            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/document/upload", formData, {
                responseType: "blob",
            });

            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `processed_${file.name}`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);

            setResponse({
                message: "Processing complete! Your download has started.",
                type: "success",
            });

            setFile(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message: error.response?.data.message ?? "Upload failed",
                    type: "error",
                });
            } else {
                setResponse({ message: "Unexpected error", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 font-sans">
            <header className="mb-10 mx-4">
                <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Document Processing
                </h1>
                <p className="text-zinc-500 mt-1">
                    Upload your Excel sheets for automated processing and
                    optimization.
                </p>
            </header>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                    {/* DROPZONE AREA */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4
                            ${
                                file
                                    ? "border-blue-500 bg-blue-50/30"
                                    : "border-zinc-200 hover:border-blue-400 hover:bg-zinc-50"
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xlsx, .xls, .csv" // Add .pdf later
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                        />

                        {file ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in-95">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
                                    <DocumentIcon className="w-8 h-8" />
                                </div>
                                <p className="text-zinc-900 font-bold">
                                    {file.name}
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                    className="mt-4 text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <XMarkIcon className="w-4 h-4" /> REMOVE
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <CloudArrowUpIcon className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-zinc-900 font-bold">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-zinc-400 text-sm mt-1">
                                        Supported formats: Excel (.xlsx, .xls,
                                        .csv)
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                        onClick={onUpload}
                        disabled={loading || !file}
                        className={`w-full mt-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                            loading || !file
                                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                        }`}
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                Processing File...
                            </>
                        ) : (
                            "Process & Download"
                        )}
                    </button>

                    {/* FEEDBACK MESSAGE */}
                    {response.message && (
                        <div
                            className={`mt-6 p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
                                response.type === "success"
                                    ? "bg-green-50 border-green-100 text-green-700"
                                    : "bg-red-50 border-red-100 text-red-700"
                            }`}
                        >
                            {response.type === "success" ? (
                                <CheckCircleIcon className="w-5 h-5" />
                            ) : (
                                <XMarkIcon className="w-5 h-5" />
                            )}
                            <p className="text-sm font-medium">
                                {response.message}
                            </p>
                        </div>
                    )}
                </div>

                {/* INFO SECTION */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-zinc-200 rounded-2xl">
                        <h3 className="font-bold text-zinc-900 mb-2">
                            How it works
                        </h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Our processor analyzes your spreadsheet, cleans the
                            data, and applies your custom logic instantly. The
                            processed file is returned immediately.
                        </p>
                    </div>
                    <div className="p-6 bg-white border border-zinc-200 rounded-2xl">
                        <h3 className="font-bold text-zinc-900 mb-2">
                            Coming Soon
                        </h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            PDF parsing and optical character recognition (OCR)
                            will be available in the next update.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Document;
