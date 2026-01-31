import { useState } from "react";

interface Props {
    closeClickLimitModal(): void;
    onSetLimit(limit: number): void;
}

const ClickLimitModal = (props: Props) => {
    const { closeClickLimitModal, onSetLimit } = props;

    const [limit, setLimit] = useState(0);
    const [error, setError] = useState("");

    const onDone = () => {
        if (limit <= 0) {
            setError("Limit must be greater than 0");
            return;
        } else {
            onSetLimit(limit);
        }

        closeClickLimitModal();
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-51 p-4"
            onClick={closeClickLimitModal}
        >
            <div
                className="bg-white w-96 rounded-xl p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">Click Limit</h2>

                <div className="mb-4">
                    <input
                        type="number"
                        placeholder="Enter limit"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className={`w-full border rounded p-2 ${
                            error ? "border-red-500 bg-red-50" : ""
                        }`}
                    />

                    {error && (
                        <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeClickLimitModal}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDone}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClickLimitModal;
