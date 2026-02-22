"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";
import { totalmem } from "os";

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
            const res = await api.get(`/api/urls/my?page=${pageNumber}&size=5`);
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
            alert("Copied to clipboard!");
        } catch (err) {
            alert("Failed to copy");
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
            alert("Failed to fetch analysis");
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
        } catch (err) {
            alert("Failed to create URL");
        }
    };

    const handleDelete = async (shortCode: string) => {
        try {
            await api.delete(`/api/urls/${shortCode}`);
            fetchUrls();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div className="p-10">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1"
                >
                    Logout
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <input
                    className="border p-2 w-96"
                    placeholder="Long URL"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                />

                <input
                    className="border p-2 w-60"
                    placeholder="Custom Alias (optional)"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                />

                <button
                    onClick={handleCreate}
                    className="bg-black text-white px-4"
                >
                    Create
                </button>
            </div>

            <div className="space-y-4">
                {urls.map((url) => (
                    <div
                        key={url.shortCode}
                        className="border p-4 flex justify-between items-center"
                    >
                        <div>
                            <p>
                                <strong>Short:</strong>{" "}
                                <a
                                    href={`${BASE_URL}/r/${url.shortCode}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {BASE_URL}/r/{url.shortCode}
                                </a>
                            </p>
                            <p>
                                <strong>Long:</strong> {url.longUrl}
                            </p>

                            {url.totalClicks !== undefined && (
                                <p className="text-green-600 mt-2">
                                    Total Clicks: {url.totalClicks}
                                </p>
                            )}

                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={() => handleCopy(url.shortCode)}
                                className="bg-gray-600 text-white px-3 py-1"
                            >
                                Copy
                            </button>

                            <button
                                onClick={() => handleAnalytics(url.shortCode)}
                                className="bg-blue-500 text-white px-3 py-1"
                            >
                                Analytics
                            </button>

                            <button
                                onClick={() => handleDelete(url.shortCode)}
                                className="bg-red-500 text-white px-3 py-1"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    disabled={page === 0}
                    onClick={() => fetchUrls(page - 1)}
                    className="bg-gray-300 px-4 py-2 disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="px-4 py-2">
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => fetchUrls(page + 1)}
                    className="bg-gray-300 px-4 py-2 disabled:opacity-50"
                >
                    Next
                </button>
            </div>

        </div>
    );
}