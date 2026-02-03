"use client";
import ShowCreateGroupModal from "@/components/dashboard/ShowCreateGroupModal";
import { api } from "@/lib/axios";
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    FolderIcon,
    PencilSquareIcon,
    CheckCircleIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { groupCollapsed } from "console";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Group {
    groupName: string;
    _id: string;
}

const Groups = () => {
    const [urlGroups, setUrlGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [editingGroupId, setEditingGroupId] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);

    const fetchAllGroups = async () => {
        try {
            setLoading(true);

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
            setLoading(false);
        }
    };

    const onDeleteGroup = async (groupId: string) => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this Group?",
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const res = await api.delete(`/group/${groupId}/delete`);

            setUrlGroups((prev) =>
                prev.filter((group) => group._id !== groupId),
            );
        } catch (error) {}
    };

    const onUpdateGroupName = async () => {
        if (!newGroupName.trim()) {
            return;
        }

        try {
            const res = await api.patch(`/group/${editingGroupId}/update`, {
                newGroupName: newGroupName.trim(),
            });
            setUrlGroups((prev) =>
                prev.map((group) =>
                    group._id === editingGroupId
                        ? { ...group, groupName: newGroupName }
                        : group,
                ),
            );

            setEditingGroupId("");
            setNewGroupName("");
        } catch (error) {}
    };

    const truncate = (text: string, max: number) =>
        text.length > max ? text.slice(0, max) + "..." : text;

    useEffect(() => {
        fetchAllGroups();
    }, []);

    useEffect(() => {
        if (editingGroupId && inputRef.current) {
            inputRef.current.focus();
            // inputRef.current.select();
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
        }
    }, [editingGroupId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 px-6">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-bold text-sm mb-8"
            >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                Back to Dashboard
            </Link>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
                            Manage Groups
                        </h1>
                        <p className="text-zinc-500 text-sm font-medium mt-1">
                            Organize and refine your URL categories.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateGroupModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 whitespace-nowrap cursor-pointer"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Group
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    {urlGroups.length > 0 ? (
                        urlGroups.map((group) => (
                            <div
                                key={group._id}
                                className={`flex items-center justify-between bg-white border p-4 pl-6 rounded-2xl transition-all group ${
                                    editingGroupId === group._id
                                        ? "border-blue-500 ring-4 ring-blue-50"
                                        : "border-zinc-200 hover:border-zinc-300 shadow-sm"
                                }`}
                            >
                                <div className="flex-1">
                                    {editingGroupId === group._id ? (
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <FolderIcon className="w-5 h-5" />
                                            </div>
                                            <input
                                                ref={
                                                    editingGroupId === group._id
                                                        ? inputRef
                                                        : null
                                                }
                                                type="text"
                                                value={
                                                    editingGroupId === group._id
                                                        ? newGroupName
                                                        : group.groupName
                                                }
                                                onChange={(e) =>
                                                    setNewGroupName(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        onUpdateGroupName();
                                                    }
                                                    if (e.key === "Escape") {
                                                        setEditingGroupId("");
                                                        setNewGroupName("");
                                                    }
                                                }}
                                                className={`font-bold text-zinc-800 tracking-tight bg-transparent outline-none w-full ${
                                                    editingGroupId === group._id
                                                        ? "cursor-text"
                                                        : "cursor-default"
                                                }`}
                                            ></input>
                                        </div>
                                    ) : (
                                        <Link
                                            className="flex items-center gap-4"
                                            href={`/dashboard/analytics/group/${group._id}`}
                                        >
                                            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <FolderIcon className="w-5 h-5" />
                                            </div>
                                            <span
                                                className={`font-bold text-zinc-800 tracking-tight bg-transparent outline-none w-full`}
                                                title={group.groupName}
                                            >
                                                {truncate(group.groupName, 80)}
                                            </span>
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center gap-1">
                                    {editingGroupId !== group._id ? (
                                        <button
                                            className="p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Edit Group Name"
                                            onClick={() => {
                                                setEditingGroupId(group._id);
                                                setNewGroupName(
                                                    group.groupName,
                                                );
                                            }}
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <div>
                                            <button
                                                className="p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Save"
                                                onClick={onUpdateGroupName}
                                            >
                                                <CheckIcon className="w-5 h-5 " />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingGroupId("");
                                                    setNewGroupName("");
                                                }}
                                                className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Cancel"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => onDeleteGroup(group._id)}
                                        className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Delete Group"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-zinc-100/30 border border-dashed border-zinc-200 rounded-3xl">
                            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">
                                No groups created yet
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showCreateGroupModal && (
                <ShowCreateGroupModal
                    onCloseGroupModal={() => setShowCreateGroupModal(false)}
                    fetchAllGroups={fetchAllGroups}
                />
            )}
        </div>
    );
};

export default Groups;
