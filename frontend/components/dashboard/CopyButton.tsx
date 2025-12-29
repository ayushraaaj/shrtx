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
                onClick={onCopy}
                className={"border px-2 py-1 text-xs rounded mt-2 cursor-pointer"}
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
