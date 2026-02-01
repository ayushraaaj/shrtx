"use client";
import { UrlDetails } from "@/app/interfaces/url";
import ClickLimitModal from "@/components/dashboard/ClickLimitModal";
import ExpirationModal from "@/components/dashboard/ExpirationModal";
import GeneratingQR from "@/components/dashboard/GeneratingQR";
import ShowCreateGroupModal from "@/components/dashboard/ShowCreateGroupModal";
import UrlPasswordModal from "@/components/dashboard/UrlPasswordModal";
import { api } from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Group {
    groupName: string;
    _id: string;
}

const UrlDetailedView = () => {
    const { urlId } = useParams();

    const [response, setResponse] = useState<UrlDetails | null>(null);

    const [showExpirationModal, setShowExpirationModal] = useState(false);
    const [showClickLimitModal, setShowClickLimitModal] = useState(false);
    const [showUrlPasswordModal, setShowUrlPasswordModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(0);
    const [expiration, setExpiration] = useState<Date | null>(null);
    const [notes, setNotes] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("ungrouped");

    const [urlGroups, setUrlGroups] = useState<Group[]>([]);

    const truncate = (text: string, max: number) =>
        text.length > max ? text.slice(0, max) + "..." : text;

    const fetchAllGroups = async () => {
        try {
            // setLoading(true);

            const res = await api.get("/group/get-all");
            // console.log(res.data.data);
            setUrlGroups(res.data.data);
        } catch (error) {
            //     if (axios.isAxiosError(error)) {
            //         setResponse({
            //             message:
            //                 error.response?.data.message ?? "Something went wrong",
            //             shortUrl: "",
            //         });
            //     } else {
            //         setResponse({ message: "Unexpected error", shortUrl: "" });
            //     }
        } finally {
            // setLoading(false);
        }
    };

    const onDeleteUrl = async (urlId: string) => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this URL?",
        );
        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/url/${urlId}/delete`);

            // setUrls((prev) => prev.filter((url) => url._id !== urlId));
            // fetchAllUrls(page, selectedGroup);
        } catch (error) {}
    };

    const fetchUrlDetails = async () => {
        try {
            const res = await api.get(`/url/details/${urlId}`);
            setResponse(res.data.data);
            setNotes(res.data.data.notes || "");
            setSelectedGroup(res.data.data.groupName || "ungrouped");
        } catch (error) {}
    };

    useEffect(() => {
        fetchUrlDetails();
        fetchAllGroups();
    }, []);

    return (
        <div>
            <h1>Url Details</h1>
            <h1>{response?.shortUrl}</h1>
            <h1>
                {response?.originalUrl && truncate(response?.originalUrl, 120)}
            </h1>
            <h1> {response?.createdAt} </h1>
            {response?.shortUrl && (
                <GeneratingQR
                    shortUrl={response?.shortUrl}
                    qrGenerated={response?.qrGenerated}
                />
            )}

            <h1>{response?.clicks}</h1>
            <h1>{response?.isActive ? "true" : "false"}</h1>

            {response?.refs &&
                response?.refs.map((ref) => (
                    <div key={ref.source}>
                        {ref.source}: {ref.clicks} clicks
                    </div>
                ))}

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

            {response?._id && (
                <button
                    onClick={() => onDeleteUrl(response?._id)}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                    Delete
                </button>
            )}

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
        </div>
    );
};

export default UrlDetailedView;
