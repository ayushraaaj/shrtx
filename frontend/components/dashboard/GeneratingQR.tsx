"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

interface Props {
    shortUrl: string;
    qrGenerated: boolean;
}

const GeneratingQR = (props: Props) => {
    const { shortUrl, qrGenerated } = props;

    const [showQR, setShowQR] = useState(qrGenerated);
    const [response, setResponse] = useState("");

    const onGenerateQR = async () => {
        try {
            const res = await api.post("/url/generate-qr", { shortUrl });

            setShowQR(true);
            setResponse(res.data.message);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse(
                    error.response?.data.message ?? "Something went wrong"
                );
            } else {
                setResponse("Unexpected error");
            }
        }
    };

    const downloadQR = () => {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qr-code.png";
        link.click();
    };

    return (
        <div>
            {showQR ? (
                <div>
                    <QRCodeCanvas value={shortUrl} size={64} />
                    <button
                        onClick={downloadQR}
                        className={"border px-2 py-1 text-xs rounded mt-2 cursor-pointer"}
                    >
                        Download QR
                    </button>
                </div>
            ) : (
                <button
                    onClick={onGenerateQR}
                    className="border px-2 py-1 text-xs rounded"
                >
                    Generate
                </button>
            )}
        </div>
    );
};

export default GeneratingQR;
