import { useState } from "react";

interface Props {
    closeClickExpirationModal(): void;
}

const ExpirationModal = (props: Props) => {
    const { closeClickExpirationModal } = props;

    const [limit, setLimit] = useState(0);
    const [error, setError] = useState("");

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-51 p-4"
            onClick={closeClickExpirationModal}
        >
            <div
                className="bg-white w-96 rounded-xl p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">Group Name</h2>

                <div className="mb-4">
                    <input
                        type="datetime-local"
                        // placeholder="Enter limit"
                        // value={limit}
                        // onChange={(e) => setLimit(Number(e.target.value))}
                        // className={`w-full border rounded p-2 ${
                        //     error ? "border-red-500 bg-red-50" : ""
                        // }`}
                    />

                    {error && (
                        <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeClickExpirationModal}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        // onClick={onAddingGroup}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpirationModal;
