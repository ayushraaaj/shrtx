import { api } from "@/lib/axios";
import { LinkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import ExpirationModal from "./ExpirationModal";
import ClickLimitModal from "./ClickLimitModal";
import UrlPasswordModal from "./UrlPasswordModal";
import ShowCreateGroupModal from "./ShowCreateGroupModal";

interface Group {
    groupName: string;
}

interface Props {
    onCloseModal(): void;
    onUrlCreated(): void;
    urlGroups: Group[];
    truncate(text: string, max: number): string;
    fetchAllGroups(): void;
}

const CreateLinkModal = (props: Props) => {
    const { onCloseModal, onUrlCreated, urlGroups, truncate, fetchAllGroups } =
        props;

    const [originalUrl, setOriginalUrl] = useState("");
    const [customName, setCustomName] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("ungrouped");
    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(0);
    const [expiration, setExpiration] = useState<Date | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    const [showExpirationModal, setShowExpirationModal] = useState(false);
    const [showClickLimitModal, setShowClickLimitModal] = useState(false);
    const [showUrlPasswordModal, setShowUrlPasswordModal] = useState(false);

    const RESERVED_WORDS = [
        "dashboard",
        "analytics",
        "group",
        "login",
        "signup",
        "api",
    ];

    const isValidUrl = (url: string) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    const isValidCustomName = (shortCode: string) => {
        if (shortCode.length > 0) {
            if (!/^[a-z0-9-_]{3,10}$/.test(shortCode)) {
                setError(
                    "Custom name must be 3-10 characters (letters, numbers, -, _)",
                );
                return false;
            }

            if (RESERVED_WORDS.includes(shortCode)) {
                setError("This custom name is reserved.");
                return false;
            }
        }
        return true;
    };

    const onShortUrl = async () => {
        if (!isValidUrl(originalUrl)) {
            setError("Please enter a valid URL (include http:// or https://)");
            return;
        }

        if (!isValidCustomName(customName)) {
            return;
        }

        if (expiration && expiration <= new Date()) {
            setError("Expiration time has already passed. Please update it.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/url", {
                originalUrl,
                customName,
                selectedGroup,
                notes,
                password,
                limit,
                expiration,
            });

            onUrlCreated();
            onCloseModal();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            } else {
                setError("Failed to create link. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onCloseModal}
            >
                <div
                    className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl w-full max-w-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-bold mb-6">Create New Link</h2>

                    <section className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="originalUrl"
                                className="text-sm font-medium text-zinc-700"
                            >
                                Destination URL
                            </label>
                            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all overflow-hidden px-4 py-4">
                                <LinkIcon className="h-5 w-5 text-zinc-400" />
                                <input
                                    id="originalUrl"
                                    className="w-full bg-transparent outline-none pl-3 text-zinc-900 placeholder:text-zinc-400"
                                    type="text"
                                    value={originalUrl}
                                    onChange={(e) =>
                                        setOriginalUrl(e.target.value)
                                    }
                                    placeholder="https://example.com/very-long-link-to-shorten"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="customName"
                                className="text-sm font-medium text-zinc-700"
                            >
                                Custom Name (Optional)
                            </label>
                            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all overflow-hidden px-4 py-4">
                                <input
                                    id="customName"
                                    type="text"
                                    placeholder="e.g. summer-sale"
                                    className="w-full bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400"
                                    value={customName}
                                    onChange={(e) =>
                                        setCustomName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-zinc-700">
                                    Group
                                </label>
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "createGroup") {
                                            setShowCreateGroupModal(true);
                                            return;
                                        }
                                        setSelectedGroup(value);
                                    }}
                                    className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                >
                                    <option value="ungrouped">Ungrouped</option>
                                    <optgroup label="My Groups">
                                        {urlGroups.map((group) => (
                                            <option
                                                key={group.groupName}
                                                value={group.groupName}
                                            >
                                                {truncate(group.groupName, 20)}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <option
                                        value="createGroup"
                                        className="text-blue-600 font-bold"
                                    >
                                        + New Group
                                    </option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="notes"
                                    className="text-sm font-medium text-zinc-700"
                                >
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-blue-500 resize-none h-[50px]"
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium">
                                {error}
                            </p>
                        )}
                    </section>

                    <footer className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowUrlPasswordModal(true)}
                                className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                            >
                                Password
                            </button>
                            <button
                                onClick={() => setShowExpirationModal(true)}
                                className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                            >
                                Expiration
                            </button>
                            <button
                                onClick={() => setShowClickLimitModal(true)}
                                className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                            >
                                Click Limit
                            </button>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={onCloseModal}
                                className="flex-1 sm:flex-none px-6 py-2.5 font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onShortUrl}
                                disabled={loading || !originalUrl}
                                className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                                    loading || !originalUrl
                                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-95"
                                }`}
                            >
                                {loading ? "Creating..." : "Create Link"}
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
            {showExpirationModal && (
                <ExpirationModal
                    closeClickExpirationModal={() =>
                        setShowExpirationModal(false)
                    }
                    onSetExpiration={(exp) => setExpiration(exp)}
                />
            )}
            {showClickLimitModal && (
                <ClickLimitModal
                    closeClickLimitModal={() => setShowClickLimitModal(false)}
                    onSetLimit={(lmt) => setLimit(lmt)}
                />
            )}
            {showUrlPasswordModal && (
                <UrlPasswordModal
                    closeUrlPasswordModal={() => setShowUrlPasswordModal(false)}
                    onSetPassword={(pwd) => setPassword(pwd)}
                />
            )}
            {showCreateGroupModal && (
                <ShowCreateGroupModal
                    onCloseGroupModal={() => setShowCreateGroupModal(false)}
                    fetchAllGroups={fetchAllGroups}
                    setSelectedGroup={setSelectedGroup}
                />
            )}
        </>
    );
};

export default CreateLinkModal;
