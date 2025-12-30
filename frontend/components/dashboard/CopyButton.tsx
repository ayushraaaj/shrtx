import { useState } from "react";

interface Props {
    shortUrl: string;
}

const CopyButton = (props: Props) => {
    const { shortUrl } = props;

    const [copied, setCopied] = useState(false);
    const [response, setResponse] = useState("");

    const onCopy = async () => {
        if (!shortUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);

            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            setResponse("Failed to copy to clipboard");
        }
    };

    return (
        <div>
            <button
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-blue-50 text-zinc-600 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                onClick={onCopy}
            >
                {copied ? "Copied!" : "Copy"}
            </button>

            {response && (
                <h1 className="font-medium text-2xl underline">{response}</h1>
            )}
        </div>
    );
};

export default CopyButton;
