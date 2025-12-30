// // "use client";
// // import { api } from "@/lib/axios";
// // import axios from "axios";
// // import { QRCodeCanvas } from "qrcode.react";
// // import { useState } from "react";

// // interface Props {
// //     shortUrl: string;
// //     qrGenerated: boolean;
// // }

// // const GeneratingQR = (props: Props) => {
// //     const { shortUrl, qrGenerated } = props;

// //     const [showQR, setShowQR] = useState(qrGenerated);
// //     const [response, setResponse] = useState("");

// //     const onGenerateQR = async () => {
// //         try {
// //             const res = await api.post("/url/generate-qr", { shortUrl });

// //             setShowQR(true);
// //             setResponse(res.data.message);
// //         } catch (error: unknown) {
// //             if (axios.isAxiosError(error)) {
// //                 setResponse(
// //                     error.response?.data.message ?? "Something went wrong"
// //                 );
// //             } else {
// //                 setResponse("Unexpected error");
// //             }
// //         }
// //     };

// //     const downloadQR = () => {
// //         const canvas = document.querySelector("canvas") as HTMLCanvasElement;
// //         const pngUrl = canvas.toDataURL("image/png");

// //         const link = document.createElement("a");
// //         link.href = pngUrl;
// //         link.download = "qr-code.png";
// //         link.click();
// //     };

// //     return (
// //         <div>
// //             {showQR ? (
// //                 <div>
// //                     <QRCodeCanvas value={shortUrl} size={64} />
// //                     <button
// //                         onClick={downloadQR}
// //                         className={"border px-2 py-1 text-xs rounded mt-2 cursor-pointer"}
// //                     >
// //                         Download QR
// //                     </button>
// //                 </div>
// //             ) : (
// //                 <button
// //                     onClick={onGenerateQR}
// //                     className="border px-2 py-1 text-xs rounded"
// //                 >
// //                     Generate
// //                 </button>
// //             )}
// //         </div>
// //     );
// // };

// // export default GeneratingQR;

// "use client";
// import { api } from "@/lib/axios";
// import axios from "axios";
// import { QRCodeCanvas } from "qrcode.react";
// import { useState } from "react";
// import { QrCodeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// interface Props {
//     shortUrl: string;
//     qrGenerated: boolean;
// }

// const GeneratingQR = (props: Props) => {
//     const { shortUrl, qrGenerated } = props;

//     const [showQR, setShowQR] = useState(qrGenerated);
//     const [response, setResponse] = useState("");
//     const [loading, setLoading] = useState(false);

//     const onGenerateQR = async () => {
//         try {
//             setLoading(true);
//             const res = await api.post("/url/generate-qr", { shortUrl });
//             setShowQR(true);
//             setResponse(res.data.message);
//         } catch (error: unknown) {
//             if (axios.isAxiosError(error)) {
//                 setResponse(
//                     error.response?.data.message ?? "Something went wrong"
//                 );
//             } else {
//                 setResponse("Unexpected error");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const downloadQR = () => {
//         const canvas = document.querySelector("canvas") as HTMLCanvasElement;
//         if (!canvas) return;
//         const pngUrl = canvas.toDataURL("image/png");

//         const link = document.createElement("a");
//         link.href = pngUrl;
//         link.download = `shrtx-qr-${Date.now()}.png`;
//         link.click();
//     };

//     return (
//         <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm max-w-sm">
//             <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-blue-50 rounded-lg">
//                     <QrCodeIcon className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <h3 className="font-bold text-zinc-900">QR Code</h3>
//             </div>

//             <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl p-6 bg-zinc-50/50">
//                 {showQR ? (
//                     <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
//                         <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-200">
//                             <QRCodeCanvas
//                                 value={shortUrl}
//                                 size={140}
//                                 level="H"
//                                 includeMargin={false}
//                             />
//                         </div>

//                         <button
//                             onClick={downloadQR}
//                             className="mt-6 flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-zinc-200"
//                         >
//                             <ArrowDownTrayIcon className="w-4 h-4" />
//                             Download PNG
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="text-center py-4">
//                         <p className="text-zinc-500 text-sm mb-4">
//                             Generate a unique QR code for your short link.
//                         </p>
//                         <button
//                             onClick={onGenerateQR}
//                             disabled={loading}
//                             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100"
//                         >
//                             {loading ? "Generating..." : "Generate QR Code"}
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {response && (
//                 <p
//                     className={`mt-4 text-center text-xs font-medium ${
//                         response.toLowerCase().includes("error")
//                             ? "text-red-500"
//                             : "text-green-600"
//                     }`}
//                 >
//                     {response}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default GeneratingQR;

"use client";
import { api } from "@/lib/axios";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useRef } from "react";
import {
    QrCodeIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassPlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

interface Props {
    shortUrl: string;
    qrGenerated: boolean;
}

const GeneratingQR = ({ shortUrl, qrGenerated }: Props) => {
    const [showQR, setShowQR] = useState(qrGenerated);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onGenerateQR = async () => {
        try {
            setLoading(true);
            await api.post("/url/generate-qr", { shortUrl });
            setShowQR(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadQR = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `qr-code.png`;
        link.click();
    };

    return (
        <div className="flex items-center gap-2">
            {showQR ? (
                <div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative p-1 bg-white border border-zinc-200 rounded-lg hover:border-blue-500 transition-all shadow-sm"
                    >
                        <QRCodeCanvas value={shortUrl} size={40} />
                        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                            <MagnifyingGlassPlusIcon className="w-4 h-4 text-blue-600" />
                        </div>
                    </button>

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full relative animate-in zoom-in duration-300">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2">
                                        Scan QR Code
                                    </h3>
                                    <p className="text-zinc-500 text-sm mb-6 truncate">
                                        {shortUrl}
                                    </p>

                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 inline-block mb-6">
                                        <QRCodeCanvas
                                            ref={canvasRef}
                                            value={shortUrl}
                                            size={200}
                                            level="H"
                                        />
                                    </div>

                                    <button
                                        onClick={downloadQR}
                                        className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
                                    >
                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                        Download PNG
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={onGenerateQR}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-blue-50 text-zinc-600 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded-lg text-xs font-bold transition-all"
                >
                    <QrCodeIcon className="w-4 h-4" />
                    {loading ? "..." : "Generate"}
                </button>
            )}
        </div>
    );
};

export default GeneratingQR;
