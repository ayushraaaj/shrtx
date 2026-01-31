"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import UrlTable from "@/components/dashboard/UrlTable";
import CopyButton from "@/components/dashboard/CopyButton";
import { UrlApiItem } from "../interfaces/url";
import {
    PlusIcon,
    MagnifyingGlassIcon,
    LinkIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import ExportModal from "@/components/dashboard/ExportModal";
import ShowCreateGroupModal from "@/components/dashboard/ShowCreateGroupModal";
import CreateLinkModal from "@/components/dashboard/CreateLinkModal";
import ClickLimitModal from "@/components/dashboard/ClickLimitModal";
import ExpirationModal from "@/components/dashboard/ExpirationModal";

const Dashboard = () => {
    const [originalUrl, setOriginalUrl] = useState("");
    const [customName, setCustomName] = useState("");

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ message: "", shortUrl: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [urls, setUrls] = useState<UrlApiItem[]>([]);
    const [page, setPage] = useState(1);
    const [isRemaining, setIsRemaining] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [showExportModal, setShowExportModal] = useState(false);

    const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);

    const [urlGroups, setUrlGroups] = useState([]);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [addUrlDone, setAddUrlDone] = useState("Add URLs");
    const [removeUrlDone, setRemoveUrlDone] = useState("Remove URLs");

    const [isBulkAddMode, setIsBulkAddMode] = useState(false);
    const [isBulkRemoveMode, setIsBulkRemoveMode] = useState(false);

    const [selectedUrlIds, setSelectedUrlIds] = useState<string[]>([]);
    const [isCheckedGlobal, setIsCheckedGlobal] = useState(false);

    const [arrowDown, setArrowDown] = useState(true);

    const dropDownGroup = () => {
        setArrowDown((prev) => !prev);
    };

    const fetchAllUrls = async (pageNumber: number, group?: string) => {
        try {
            setLoading(true);

            const activeGroup = group ?? selectedGroup;

            const res = await api.get(
                `/url/get-all?page=${pageNumber}&search=${searchText}&group=${activeGroup}`,
            );

            const urlsData = res.data.data.urls;

            setUrls((prev) => {
                if (pageNumber === 1) return urlsData;
                const existingIds = new Set(prev.map((url) => url._id));
                const uniqueItems = urlsData.filter(
                    (url: UrlApiItem) => !existingIds.has(url._id),
                );
                return [...prev, ...uniqueItems];
            });

            if (urlsData.length <= 5) setIsRemaining(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            } else {
                setResponse({ message: "Unexpected error", shortUrl: "" });
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMore = (group?: string) => {
        const activeGroup = group ?? selectedGroup;

        const nextPage = page + 1;
        setPage(nextPage);
        fetchAllUrls(nextPage, activeGroup);
    };

    const onToggleStatus = async (urlId: string) => {
        try {
            const res = await api.patch(`/url/${urlId}/togglestatus`);
            const newStatus = res.data.data.isActive;
            setUrls((prev) =>
                prev.map((url) =>
                    url._id === urlId ? { ...url, isActive: newStatus } : url,
                ),
            );
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            }
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
            fetchAllUrls(page, selectedGroup);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            } else {
                setResponse({ message: "Unexpected error", shortUrl: "" });
            }
        }
    };

    const onAddUrlsDone = async () => {
        if (
            selectedGroup === "all" ||
            selectedGroup === "ungrouped" ||
            selectedGroup === "createGroup"
        ) {
            return;
        }

        try {
            if (addUrlDone === "Add URLs") {
                setAddUrlDone("Done");
                setIsBulkAddMode(true);
            } else {
                const res = await api.post("/group/assign-bulk", {
                    groupName: selectedGroup,
                    urlIds: selectedUrlIds,
                });

                setResponse({ message: res.data.message, shortUrl: "" });

                fetchAllUrls(1, selectedGroup);
                setAddUrlDone("Add URLs");
                setIsBulkAddMode(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            } else {
                setResponse({ message: "Unexpected error", shortUrl: "" });
            }
        }
    };

    const onRemoveUrlsDone = async () => {
        if (
            selectedGroup === "all" ||
            selectedGroup === "ungrouped" ||
            selectedGroup === "createGroup"
        ) {
            return;
        }

        try {
            if (removeUrlDone === "Remove URLs") {
                setRemoveUrlDone("Done");
                setIsBulkRemoveMode(true);
            } else {
                const res = await api.post("/group/remove-bulk", {
                    groupName: selectedGroup,
                    urlIds: selectedUrlIds,
                });

                setResponse({ message: res.data.message, shortUrl: "" });

                fetchAllUrls(1, selectedGroup);
                setRemoveUrlDone("Remove URLs");
                setIsBulkRemoveMode(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            } else {
                setResponse({ message: "Unexpected error", shortUrl: "" });
            }
        }
    };

    const fetchAllGroups = async () => {
        try {
            const res = await api.get("/group/get-all");
            // console.log(res.data.data);
            setUrlGroups(res.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setResponse({
                    message:
                        error.response?.data.message ?? "Something went wrong",
                    shortUrl: "",
                });
            } else {
                setResponse({ message: "Unexpected error", shortUrl: "" });
            }
        }
    };

    const truncate = (text: string, max = 25) =>
        text.length > max ? text.slice(0, max) + "…" : text;

    useEffect(() => {
        setButtonDisabled(originalUrl.length === 0);
    }, [originalUrl]);

    useEffect(() => {
        if (addUrlDone === "Done") {
            fetchAllUrls(1, "ungrouped");
        } else {
            fetchAllUrls(1);
        }

        setPage(1);
        setIsRemaining(true);
    }, [searchText, selectedGroup, addUrlDone]);

    useEffect(() => {
        if (!response.message) return;
        const timer = setTimeout(() => {
            setResponse({ message: "", shortUrl: "" });

            setOriginalUrl("");
            setCustomName("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [response.message]);

    useEffect(() => {
        fetchAllGroups();
    }, []);

    useEffect(() => {
        if (!isBulkAddMode || !isBulkRemoveMode) {
            setSelectedUrlIds([]);
            setIsCheckedGlobal(false);
        }
    }, [isBulkAddMode, isBulkRemoveMode]);

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            <div className="max-w-8xl mx-auto px-6">
                <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-zinc-500 mt-1">
                            Manage and track your shortened links performance.
                        </p>
                    </div>

                    <button
                        className={`flex items-center gap-2 px-5 py-4 bg-white border border-blue-100 text-blue-600 rounded-xl text-xs font-bold transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 active:scale-95 disabled:opacity-70 shadow-sm shadow-blue-500/5`}
                        onClick={() => setShowCreateLinkModal(true)}
                    >
                        <>
                            <PlusIcon className="w-5 h-5" /> Create Link
                        </>
                    </button>
                </header>

                {/* <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm mb-12">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all overflow-hidden group">
                            <div className="relative flex-1 flex items-center">
                                <div className="pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-zinc-400" />
                                </div>
                                <input
                                    className="w-full bg-transparent outline-none pl-3 pr-2 py-4 text-zinc-900 placeholder:text-zinc-400"
                                    type="text"
                                    value={originalUrl}
                                    onChange={(e) =>
                                        setOriginalUrl(e.target.value)
                                    }
                                    placeholder="Paste your long link here..."
                                />
                            </div>

                            <div className="text-zinc-300 font-light text-2xl select-none px-1">
                                /
                            </div>

                            <div className="w-1/3 min-w-30 md:w-64 border-zinc-200/50">
                                <input
                                    type="text"
                                    placeholder="Custom name (optional)"
                                    className="w-full bg-transparent outline-none px-4 py-4 text-zinc-900 placeholder:text-zinc-400"
                                    value={customName}
                                    onChange={(e) =>
                                        setCustomName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                                buttonDisabled || loading
                                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                            }`}
                            onClick={onShortUrl}
                            disabled={buttonDisabled || loading}
                        >
                            {loading ? (
                                "Working..."
                            ) : (
                                <>
                                    <PlusIcon className="w-5 h-5" /> Shorten
                                    Link
                                </>
                            )}
                        </button>
                    </div>

                    {response.message && (
                        <div
                            className={`mt-8 p-5 rounded-2xl border animate-in fade-in slide-in-from-top-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                                response.message
                                    .toLowerCase()
                                    .includes("already")
                                    ? "bg-amber-50 border-amber-100"
                                    : response.shortUrl
                                      ? "bg-blue-50 border-blue-100"
                                      : "bg-red-50 border-red-100"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2.5 rounded-xl ${
                                        response.message
                                            .toLowerCase()
                                            .includes("already")
                                            ? "bg-amber-100 text-amber-600"
                                            : "bg-blue-100 text-blue-600"
                                    }`}
                                >
                                    {response.message
                                        .toLowerCase()
                                        .includes("already") ? (
                                        <InformationCircleIcon className="w-6 h-6" />
                                    ) : (
                                        <CheckCircleIcon className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <p
                                        className={`text-xs font-bold uppercase tracking-widest ${
                                            response.message
                                                .toLowerCase()
                                                .includes("already")
                                                ? "text-amber-700"
                                                : "text-blue-700"
                                        }`}
                                    >
                                        {response.message}
                                    </p>
                                    {response.shortUrl && (
                                        <Link
                                            href={response.shortUrl}
                                            target="_blank"
                                            className="text-zinc-900 font-bold hover:text-blue-600 transition-colors break-all"
                                        >
                                            {response.shortUrl}
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {response.shortUrl && (
                                <CopyButton shortUrl={response.shortUrl} />
                            )}
                        </div>
                    )}
                </section> */}

                <section className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-50/30">
                        <h2 className="text-lg font-bold text-zinc-800">
                            Your URL History
                        </h2>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative">
                                <select
                                    onClick={dropDownGroup}
                                    className="appearance-none bg-white border border-zinc-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-zinc-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer shadow-sm disabled:bg-zinc-50 disabled:text-zinc-400"
                                    disabled={isBulkAddMode || isBulkRemoveMode}
                                    value={selectedGroup}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "createGroup") {
                                            setShowCreateGroupModal(true);
                                            return;
                                        }
                                        setSelectedGroup(value);
                                    }}
                                >
                                    <option title="All Links" value="all">
                                        All Links
                                    </option>
                                    <option title="Ungrouped" value="ungrouped">
                                        Ungrouped
                                    </option>
                                    <optgroup label="Groups">
                                        {urlGroups.map((group: any) => (
                                            <option
                                                title={group.groupName}
                                                key={group.groupName}
                                                value={group.groupName}
                                            >
                                                {truncate(group.groupName, 10)}
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
                                <div
                                    className={`absolute inset-y-0 right-2 flex items-center pointer-events-none text-zinc-400 transition-transform duration-75 ${arrowDown ? "rotate-0" : "rotate-180"}`}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center bg-white border border-zinc-200 p-1 rounded-xl shadow-sm">
                                <button
                                    title={
                                        addUrlDone === "Done"
                                            ? "Save Selections"
                                            : "Add URLs to Group"
                                    }
                                    disabled={removeUrlDone === "Done"}
                                    onClick={onAddUrlsDone}
                                    className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                                        addUrlDone === "Done"
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 disabled:opacity-20"
                                    }`}
                                >
                                    {addUrlDone === "Done" ? (
                                        <CheckCircleIcon className="w-5 h-5" />
                                    ) : (
                                        <PlusIcon className="w-5 h-5 stroke-[2.5]" />
                                    )}
                                </button>

                                <div className="w-px h-4 bg-zinc-200 mx-1" />

                                <button
                                    title={
                                        removeUrlDone === "Done"
                                            ? "Confirm Removal"
                                            : "Remove URLs from Group"
                                    }
                                    disabled={addUrlDone === "Done"}
                                    onClick={onRemoveUrlsDone}
                                    className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                                        removeUrlDone === "Done"
                                            ? "bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-red-600 disabled:opacity-20"
                                    }`}
                                >
                                    {removeUrlDone === "Done" ? (
                                        <CheckCircleIcon className="w-5 h-5" />
                                    ) : (
                                        <div className="w-5 h-5 flex items-center justify-center font-bold text-xl leading-none">
                                            <span className="mb-1">−</span>
                                        </div>
                                    )}
                                </button>
                            </div>

                            <button
                                onClick={() => setShowExportModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                                <ArrowDownTrayIcon className="w-4 h-4 text-zinc-500" />
                                Export
                            </button>

                            <div className="relative w-full sm:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-4 w-4 text-zinc-400" />
                                </div>
                                <input
                                    className="w-full bg-white border border-zinc-200 outline-none pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-blue-500 transition-all shadow-sm"
                                    type="text"
                                    placeholder="Search links..."
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="min-h-35">
                        <UrlTable
                            urls={urls}
                            onToggleStatus={onToggleStatus}
                            onDeleteUrl={onDeleteUrl}
                            isBulkAddMode={isBulkAddMode}
                            isBulkRemoveMode={isBulkRemoveMode}
                            selectedUrlIds={selectedUrlIds}
                            setSelectedUrlIds={setSelectedUrlIds}
                            isCheckedGlobal={isCheckedGlobal}
                            setIsCheckedGlobal={setIsCheckedGlobal}
                        />
                        {urls.length === 0 && !loading && (
                            <div className="py-20 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                    <LinkIcon className="w-8 h-8 text-zinc-300" />
                                </div>
                                <p className="text-zinc-500 font-medium">
                                    No links found yet.
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    Start shortening to see your history here.
                                </p>
                            </div>
                        )}
                    </div>

                    {isRemaining && (
                        <div className="p-6 border-t border-zinc-100 flex justify-center">
                            <button
                                className="cursor-pointer text-sm font-bold text-zinc-600 hover:text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl transition-all disabled:opacity-50"
                                onClick={() => {
                                    if (addUrlDone == "Done") {
                                        loadMore("ungrouped");
                                    } else {
                                        loadMore();
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading more..."
                                    : "Load More Activity"}
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {showExportModal && (
                <ExportModal onCloseModal={() => setShowExportModal(false)} />
            )}

            {showCreateGroupModal && (
                <ShowCreateGroupModal
                    onCloseGroupModal={() => setShowCreateGroupModal(false)}
                    fetchAllGroups={fetchAllGroups}
                />
            )}
            {showCreateLinkModal && (
                <CreateLinkModal
                    onCloseModal={() => setShowCreateLinkModal(false)}
                    onUrlCreated={() => {
                        setIsRemaining(true);
                        setPage(1);
                        fetchAllUrls(1);
                    }}
                    urlGroups={urlGroups}
                    truncate={truncate}
                    openCreateGroupModal={() => setShowCreateGroupModal(true)}
                />
            )}
        </div>
    );
};

export default Dashboard;
