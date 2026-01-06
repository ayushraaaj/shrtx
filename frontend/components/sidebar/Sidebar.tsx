"use client";
import SidebarItem from "./SidebarItem";
import {
    Squares2X2Icon,
    ChartBarIcon,
    LinkIcon,
} from "@heroicons/react/24/outline";
import Logout from "../logout/Logout";
import Link from "next/link";

const Sidebar = () => {
    return (
        <aside className="w-68 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0">
            <div className="p-8 flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <LinkIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-zinc-900 tracking-tight">
                    <Link href="/">Shrtx</Link>
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                <div className="px-4 mb-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        Menu
                    </span>
                </div>

                <SidebarItem
                    href="/dashboard"
                    label="Dashboard"
                    icon={<Squares2X2Icon className="w-5 h-5" />}
                />
                <SidebarItem
                    href="/dashboard/analytics"
                    label="Analytics"
                    icon={<ChartBarIcon className="w-5 h-5" />}
                />
            </nav>

            <div className="p-4 border-t border-zinc-50">
                <Logout />
            </div>
        </aside>
    );
};

export default Sidebar;
