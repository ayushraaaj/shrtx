import { api } from "@/lib/axios";
import { useState } from "react";

interface Props {
    onCloseUrlModal(): void;
    fetchAllGroups(): void;
}

const ExportGroupUrlModal = (props: Props) => {
    const { onCloseUrlModal, fetchAllGroups } = props;

    const [groupName, setGroupName] = useState("");
    const [error, setError] = useState("");

    const onAddingGroup = async () => {
        try {
            if (!groupName || groupName.length === 0) {
                setError("Please enter a name");
                return;
            }

            const res = await api.post("/group/create", { groupName });

            console.log(res.data);

            onCloseUrlModal();
            fetchAllGroups();
        } catch (error) {}
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Group Name</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
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
                        onClick={onCloseUrlModal}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onAddingGroup}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportGroupUrlModal;
