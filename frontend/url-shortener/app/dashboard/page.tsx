"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { totalmem } from "os";
import { useToast, ToastContainer } from "@/app/components/Toast";

interface Url {
    shortCode: string;
    longUrl: string;
    createdAt: string;
    totalClicks?: number;
}

const BASE_URL = "http://localhost:8080";

export default function DashboardPage() {
    const router = useRouter();
    const [urls, setUrls] = useState<Url[]>([]);
    const [longUrl, setLongUrl] = useState<string>("");
    const [customAlias, setCustomAlias] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
        } else {
            fetchUrls(0);
        }
    }, []);

    const fetchUrls = async (pageNumber: number = page) => {
        try {
            const res = await api.get(`/api/urls/my?page=${pageNumber}&size=5&sort=createdAt,desc`);
            setUrls(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(pageNumber);
        } catch (err) {
            console.log("Error fetching URLs");
        }
    };

    const handleCopy = async (shortCode: string) => {
        const shortUrl = `http://localhost:8080/r/${shortCode}`;

        try {
            await navigator.clipboard.writeText(shortUrl);
            showToast("Copied to clipboard!", "success");
        } catch (err) {
            showToast("Failed to copy", "error");
        }
    };

    const handleAnalytics = async (shortCode: string) => {
        const res = await api.get(`/api/urls/${shortCode}/analytics`);

        try {
            setUrls((prev) =>
                prev.map((url) =>
                    url.shortCode == shortCode ? { ...url, totalClicks: res.data.totalClicks } : url
                )
            );
        } catch (err) {
            showToast("Failed to fetch analytics", "error");
        }
    }


    const handleCreate = async () => {
        try {

            const trimmedLongUrl = longUrl.trim();
            const trimmedAlias = customAlias.trim();

            await api.post("/api/urls", {
                longUrl: trimmedLongUrl,
                customAlias: trimmedAlias || null,
            });

            setLongUrl("");
            setCustomAlias("");
            fetchUrls();
            showToast("URL created successfully","success")
        } catch (err) {
            showToast("Failed to create URL", "error");
        }
    };

    const handleDelete = async (shortCode: string) => {
        try {
            await api.delete(`/api/urls/${shortCode}`);
            fetchUrls();
            showToast("Successfully deleted", "success")
        } catch (err) {
            showToast("Delete failed", "error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                        Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Create URL Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Shorten a URL
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            placeholder="Paste your long URL here..."
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                        />

                        <input
                            className="sm:w-52 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            placeholder="Custom alias (optional)"
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                        />

                        <button
                            onClick={handleCreate}
                            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                            Create
                        </button>
                    </div>
                </div>

                {/* URLs List */}
                <div className="space-y-4">
                    {urls.map((url) => (
                        <div
                            key={url.shortCode}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-500 mb-1">
                                    <span className="font-medium text-gray-400 uppercase text-xs tracking-wide">Short</span>
                                </p>
                                <a
                                    href={`${BASE_URL}/r/${url.shortCode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm truncate block transition-colors"
                                >
                                    {BASE_URL}/r/{url.shortCode}
                                </a>
                                <p className="text-sm text-gray-500 mt-2 truncate">
                                    <span className="font-medium text-gray-400 uppercase text-xs tracking-wide">Long</span>{" "}
                                    <span className="ml-1">{url.longUrl}</span>
                                </p>

                                {url.totalClicks !== undefined && (
                                    <p className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                        Total Clicks: {url.totalClicks}
                                    </p>
                                )}

                            </div>

                            <div className="flex gap-2 shrink-0">

                                <button
                                    onClick={() => handleCopy(url.shortCode)}
                                    className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Copy
                                </button>

                                <button
                                    onClick={() => handleAnalytics(url.shortCode)}
                                    className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                                >
                                    Analytics
                                </button>

                                <button
                                    onClick={() => handleDelete(url.shortCode)}
                                    className="text-sm font-medium px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                        disabled={page === 0}
                        onClick={() => fetchUrls(page - 1)}
                        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-500 px-4 py-2">
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => fetchUrls(page + 1)}
                        className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </main>

        </div>
    );
}