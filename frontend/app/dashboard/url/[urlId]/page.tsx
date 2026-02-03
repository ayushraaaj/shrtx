"use client";
import { UrlDetails } from "@/app/interfaces/url";
import ClickLimitModal from "@/components/dashboard/ClickLimitModal";
import CopyButton from "@/components/dashboard/CopyButton";
import ExpirationModal from "@/components/dashboard/ExpirationModal";
import GeneratingQR from "@/components/dashboard/GeneratingQR";
import ShowCreateGroupModal from "@/components/dashboard/ShowCreateGroupModal";
import UrlPasswordModal from "@/components/dashboard/UrlPasswordModal";
import { api } from "@/lib/axios";
import {
    ArrowLeftIcon,
    ArrowTopRightOnSquareIcon,
    CalendarIcon,
    CheckIcon,
    CursorArrowRaysIcon,
    DocumentDuplicateIcon,
    LockClosedIcon,
    PencilSquareIcon,
    PowerIcon,
    ShareIcon,
    ShieldCheckIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Group {
    groupName: string;
    _id: string;
}

const UrlDetailedView = () => {
    const { urlId } = useParams();

    const clickLimitRef = useRef(false);
    const passwordRef = useRef(false);
    const expirationRef = useRef(false);

    const [response, setResponse] = useState<UrlDetails | null>(null);
    const [loading, setLoading] = useState(false);

    const [showExpirationModal, setShowExpirationModal] = useState(false);
    const [showClickLimitModal, setShowClickLimitModal] = useState(false);
    const [showUrlPasswordModal, setShowUrlPasswordModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    const [selectedGroup, setSelectedGroup] = useState("ungrouped");
    const [isActive, setIsActive] = useState(false);

    const [urlGroups, setUrlGroups] = useState<Group[]>([]);

    const [isEditingUrlNotes, setIsEditingUrlNotes] = useState(false);

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
            // setNotes(res.data.data.notes || "");
            setSelectedGroup(res.data.data.groupName || "ungrouped");
            // setLimit(res.data.data.limit);
        } catch (error) {}
    };

    const updateLimit = async (limit: number | null) => {
        try {
            const res = await api.patch(`/url/limit/${response?._id}`, {
                limit,
            });
        } catch (error) {
        } finally {
            clickLimitRef.current = false;
        }
    };

    const setUnsetLimit = () => {
        clickLimitRef.current = true;

        if (response?.limit === null) {
            setShowClickLimitModal(true);
        } else {
            setResponse((prev) => (prev ? { ...prev, limit: null } : prev));
        }
    };

    const updatePassword = async (password: string | null) => {
        try {
            const res = await api.patch(`/url/password/${response?._id}`, {
                password,
            });
        } catch (error) {
        } finally {
            passwordRef.current = false;
        }
    };

    const setUnsetPassword = () => {
        passwordRef.current = true;

        if (response?.password === null) {
            setShowUrlPasswordModal(true);
        } else {
            setResponse((prev) => (prev ? { ...prev, password: null } : prev));
        }
    };

    const updateExpiration = async (expiration: Date | null) => {
        try {
            const res = await api.patch(`/url/expiration/${response?._id}`, {
                expiration,
            });
        } catch (error) {
        } finally {
            expirationRef.current = false;
        }
    };

    const setUnsetExpiration = () => {
        expirationRef.current = true;

        if (response?.expiration === null) {
            setShowExpirationModal(true);
        } else {
            setResponse((prev) =>
                prev ? { ...prev, expiration: null } : prev,
            );
        }
    };

    useEffect(() => {
        if (!response) {
            return;
        }

        if (clickLimitRef.current) {
            updateLimit(response.limit);
        }

        if (passwordRef.current) {
            updatePassword(response.password);
        }

        if (expirationRef.current) {
            updateExpiration(response.expiration);
        }
    }, [response]);

    useEffect(() => {
        fetchUrlDetails();
        fetchAllGroups();
    }, []);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );

    const platforms = [
        { name: "instagram", color: "text-pink-600 bg-pink-50" },
        { name: "facebook", color: "text-blue-600 bg-blue-50" },
        { name: "twitter", color: "text-sky-500 bg-sky-50" },
        { name: "whatsapp", color: "text-green-600 bg-green-50" },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 px-6">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-bold text-sm group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 mt-3">
                    <div className="">
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
                            Url Detailed View
                        </h1>
                        <p className="text-zinc-500 mt-1">
                            Manage security settings, organize groups, and track
                            referral performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all border shadow-sm ${
                                isActive
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : "bg-zinc-100 border-zinc-200 text-zinc-400"
                            }`}
                        >
                            <PowerIcon className="w-4 h-4" />
                            {isActive ? "Link Active" : "Link Inactive"}
                        </button>
                        <button
                            title="Delete"
                            className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-2xl transition-all"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-5">
                        <section className="bg-white border border-zinc-200 rounded-3xl px-7 py-4 shadow-sm mb-5">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-8 flex flex-col gap-4">
                                    <div>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">
                                            Short Link
                                        </span>
                                        {response?.shortUrl && (
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={response.shortUrl}
                                                    target="_blank"
                                                    className="text-xl font-bold text-blue-600 hover:underline flex items-center gap-2"
                                                >
                                                    {response.shortUrl.replace(
                                                        /(^\w+:|^)\/\//,
                                                        "",
                                                    )}
                                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                                </Link>
                                                <CopyButton
                                                    shortUrl={response.shortUrl}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 block">
                                            Destination
                                        </span>
                                        <p className="text-zinc-600 font-medium truncate">
                                            {response?.originalUrl.replace(
                                                /(^\w+:|^)\/\//,
                                                "",
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 bg-zinc-50 rounded-2xl px-6 py-5 border border-zinc-100 flex flex-col items-center justify-center text-center">
                                    <div className="p-3 bg-white rounded-xl shadow-sm mb-3">
                                        <CursorArrowRaysIcon className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <p className="text-4xl font-black text-zinc-900">
                                        {response?.clicks}
                                    </p>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                        Total Clicks
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white border border-zinc-200 rounded-3xl px-7 py-6 shadow-sm flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
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
                                    className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-blue-500 font-bold text-sm min-w-[500px]"
                                >
                                    <option value="ungrouped">Ungrouped</option>
                                    <optgroup label="My Groups">
                                        {urlGroups.map((group) => (
                                            <option
                                                key={group._id}
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
                            <button className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 self-end transition-all duration-500 active:scale-95">
                                Save Changes
                            </button>
                        </section>

                        <section className="bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-zinc-50 bg-zinc-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <ShareIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                                        Referral Links
                                    </h3>
                                </div>
                            </div>
                            <div className="divide-y divide-zinc-50">
                                {platforms.map((platform, idx) => {
                                    const refUrl = `${response?.shortUrl}?ref=${platform.name}`;

                                    const refData = response?.refs?.find((r) =>
                                        r.source
                                            .toLowerCase()
                                            .includes(platform.name),
                                    );

                                    return (
                                        <div
                                            key={idx}
                                            className="p-4 hover:bg-zinc-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                        >
                                            <div className="space-y-1 flex-1">
                                                <span
                                                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${platform.color}`}
                                                >
                                                    {platform.name}
                                                </span>
                                                <p className="text-sm font-bold text-zinc-500 break-all font-mono mt-2 italic">
                                                    {refUrl.replace(
                                                        /(^\w+:|^)\/\//,
                                                        "",
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-left min-w-17.5">
                                                    <p className="text-sm font-black text-zinc-900">
                                                        {refData?.clicks || 0}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">
                                                        Clicks
                                                    </p>
                                                </div>
                                                <button className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-all duration-500 active:scale-95">
                                                    Copy Link
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-white border border-zinc-200 rounded-[32px] py-10 shadow-sm flex flex-col items-center mb-5">
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 mb-4">
                                {response?.shortUrl && (
                                    <GeneratingQR
                                        shortUrl={response.shortUrl}
                                        qrGenerated={response?.qrGenerated}
                                    />
                                )}
                            </div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Digital Asset: QR Code
                            </p>
                        </section>

                        <section className="bg-white border border-zinc-200 rounded-[32px] p-6 shadow-sm space-y-4 mb-5">
                            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
                                <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                                Link Security
                            </h3>

                            <div
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${response?.password === null ? "bg-blue-50/40 border-blue-100" : "bg-zinc-50 border-zinc-100"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <LockClosedIcon
                                        className={`w-5 h-5 ${response?.limit ? "text-blue-600" : "text-zinc-400"}`}
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900">
                                            Password
                                        </p>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                                            {response?.password === null
                                                ? "None"
                                                : "Active"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={setUnsetPassword}
                                    className={`text-[10px] font-black uppercase tracking-tighter hover:underline ${response?.password !== null ? "text-red-500" : "text-blue-600"}`}
                                >
                                    {response?.password === null
                                        ? "Set"
                                        : "Unset"}
                                </button>
                            </div>

                            <div
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${response?.expiration === null ? "bg-blue-50/40 border-blue-100" : "bg-zinc-50 border-zinc-100"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <CalendarIcon
                                        className={`w-5 h-5 ${response?.expiration ? "text-blue-600" : "text-zinc-400"}`}
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900">
                                            Expiration
                                        </p>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                                            {!response?.expiration
                                                ? "Never"
                                                : `${new Date(response.expiration).toLocaleDateString()} - ${new Date(response.expiration).toLocaleTimeString()}`}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={setUnsetExpiration}
                                    className={`text-[10px] font-black uppercase tracking-tighter hover:underline ${response?.expiration !== null ? "text-red-500" : "text-blue-600"}`}
                                >
                                    {response?.expiration === null
                                        ? "Set"
                                        : "Unset"}
                                </button>
                            </div>

                            <div
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${response?.limit === null ? "bg-blue-50/40 border-blue-100" : "bg-zinc-50 border-zinc-100"}`}
                            >
                                <div className="flex items-center gap-3">
                                    <CursorArrowRaysIcon
                                        className={`w-5 h-5 ${response?.limit ? "text-blue-600" : "text-zinc-400"}`}
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900">
                                            Click Limit
                                        </p>
                                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                                            {response?.limit === null
                                                ? "Unlimited"
                                                : `${response?.limit} left`}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={setUnsetLimit}
                                    className={`text-[10px] font-black uppercase tracking-tighter hover:underline ${response?.limit !== null ? "text-red-500" : "text-blue-600"}`}
                                >
                                    {response?.limit === null ? "Set" : "Unset"}
                                </button>
                            </div>
                        </section>

                        <section className="bg-white border border-zinc-200 rounded-[32px] p-5 shadow-sm">
                            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
                                <PencilSquareIcon className="w-4 h-4 text-zinc-400" />
                                Internal Notes
                            </h3>
                            <textarea
                                // value={notes}
                                // onChange={(e) => setNotes(e.target.value)}
                                className={`w-full h-32 bg-zinc-50 border-none rounded-2xl p-4 text-sm font-medium ${isEditingUrlNotes ? "focus:ring-2 focus:ring-blue-500/10 transition-all" : ""} outline-none resize-none`}
                                placeholder="Write private notes about this campaign..."
                                readOnly={!isEditingUrlNotes}
                            />
                            <div className="flex justify-center">
                                {!isEditingUrlNotes ? (
                                    <button
                                        className="p-1.5 -mb-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit Group Name"
                                        onClick={() =>
                                            setIsEditingUrlNotes(true)
                                        }
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <div className="-mb-2">
                                        <button
                                            className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Save"
                                            onClick={() =>
                                                setIsEditingUrlNotes(false)
                                            }
                                        >
                                            <CheckIcon className="w-5 h-5 " />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsEditingUrlNotes(false)
                                            }
                                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Cancel"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {showExpirationModal && (
                    <ExpirationModal
                        closeClickExpirationModal={() =>
                            setShowExpirationModal(false)
                        }
                        onSetExpiration={(exp) =>
                            setResponse((prev) =>
                                prev ? { ...prev, expiration: exp } : prev,
                            )
                        }
                    />
                )}
                {showClickLimitModal && (
                    <ClickLimitModal
                        closeClickLimitModal={() =>
                            setShowClickLimitModal(false)
                        }
                        onSetLimit={(lmt) =>
                            setResponse((prev) =>
                                prev ? { ...prev, limit: lmt } : prev,
                            )
                        }
                    />
                )}
                {showUrlPasswordModal && (
                    <UrlPasswordModal
                        closeUrlPasswordModal={() =>
                            setShowUrlPasswordModal(false)
                        }
                        onSetPassword={(pwd) =>
                            setResponse((prev) =>
                                prev ? { ...prev, password: pwd } : prev,
                            )
                        }
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
        </div>
    );
};

export default UrlDetailedView;
