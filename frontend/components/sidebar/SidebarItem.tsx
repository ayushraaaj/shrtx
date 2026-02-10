"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
    href: string;
    label: string;
    icon: ReactNode;
}

const getActiveTab = (pathname: string) => {
    if (pathname.includes("/settings")) return "settings";
    if (pathname.includes("/analytics")) return "analytics";

    if (pathname.startsWith("/dashboard/url")) return "dashboard";
    if (pathname.startsWith("/dashboard/group")) return "group";
    if (pathname.startsWith("/dashboard/document")) return "document";

    if (pathname === "/dashboard") return "dashboard";

    return null;
};

const getTabKeyFromHref = (href: string) => {
    if (href.includes("settings")) return "settings";
    if (href.includes("analytics")) return "analytics";
    if (href.includes("group")) return "group";
    if (href.includes("document")) return "document";
    if (href.includes("dashboard")) return "dashboard";

    return null;
};

const SidebarItem = ({ href, label, icon }: Props) => {
    const pathname = usePathname();

    // const isTabActive =
    //     href === "/dashboard"
    //         ? pathname === "/dashboard"
    //         : pathname.startsWith(href);

    const activeTab = getActiveTab(pathname);
    const currentTab = getTabKeyFromHref(href);

    const isTabActive = activeTab === currentTab;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                isTabActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
        >
            <span
                className={`transition-colors duration-300 ${
                    isTabActive
                        ? "text-blue-600"
                        : "text-zinc-400 group-hover:text-zinc-600"
                }`}
            >
                {icon}
            </span>

            {label}

            {isTabActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            )}
        </Link>
    );
};

export default SidebarItem;
