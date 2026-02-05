"use client";
import { useState, useEffect } from "react";

interface Props {
    closeDeleteConfirmModal(): void;
    onDelete(option: string): void;
}

const DeleteConfirmationModal = (props: Props) => {
    const { closeDeleteConfirmModal, onDelete } = props;

    const [deleteOption, setDeleteOption] = useState("");
    const [error, setError] = useState("");

    const handleDelete = () => {
        if (!deleteOption) {
            setError("Select an option to proceed.");
            return;
        }

        onDelete(deleteOption);

        closeDeleteConfirmModal();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white w-96 rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Delete.</h2>

                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                        <input
                            type="radio"
                            name="deleteOption"
                            id="withoutUrl"
                            value="withoutUrl"
                            onChange={(e) => {
                                setDeleteOption(e.target.value);
                                setError("");
                            }}
                        />
                        <label htmlFor="withoutUrl">Delete only group</label>
                    </div>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="radio"
                            name="deleteOption"
                            id="withUrl"
                            value="withUrl"
                            onChange={(e) => {
                                setDeleteOption(e.target.value);
                                setError("");
                            }}
                        />
                        <label htmlFor="withUrl">
                            Delete group along with urls
                        </label>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-xs font-medium animate-pulse">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeDeleteConfirmModal}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
