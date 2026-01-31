import { useState } from "react";

interface Props {
    closeUrlPasswordModal(): void;
    onSetPassword(password: string): void;
}

const UrlPasswordModal = (props: Props) => {
    const { closeUrlPasswordModal, onSetPassword } = props;

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onDone = () => {
        const pwd = password.trim();
        if (!pwd) {
            setError("Please enter password");
            return;
        } else {
            onSetPassword(pwd);
        }

        closeUrlPasswordModal();
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-51 p-4"
            onClick={closeUrlPasswordModal}
        >
            <div
                className="bg-white w-96 rounded-xl p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">Link Password</h2>

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        onClick={closeUrlPasswordModal}
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

export default UrlPasswordModal;
