"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function DemoPage() {
    const [url, setUrl] = useState("");

    const mockLinks = [
        {
            id: 1,
            original: "https://github.com/your-profile/project",
            short: "shrtx.link/git-repo",
            clicks: 124,
        },
        {
            id: 2,
            original: "https://linkedin.com/in/your-name",
            short: "shrtx.link/my-link",
            clicks: 89,
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
            <Header />

            <main className="max-w-3xl mx-auto pt-16 px-6">
                <h1 className="text-3xl font-bold mb-8">Dashboard Preview</h1>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-12">
                    <label className="block text-sm font-semibold text-zinc-500 mb-2">
                        Shorten a new link
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="https://example.com/very-long-url"
                            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                            Shorten
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                        Your Recent Links
                    </h2>
                    {mockLinks.map((link) => (
                        <div
                            key={link.id}
                            className="bg-white border border-zinc-200 p-5 rounded-xl flex items-center justify-between group hover:border-blue-200 transition-all"
                        >
                            <div className="overflow-hidden mr-4">
                                <p className="text-blue-600 font-bold truncate">
                                    {link.short}
                                </p>
                                <p className="text-zinc-400 text-sm truncate">
                                    {link.original}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-zinc-900">
                                        {link.clicks}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        clicks
                                    </p>
                                </div>
                                <button className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                                    Copy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
