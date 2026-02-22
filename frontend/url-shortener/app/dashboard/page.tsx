"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Url {
  id: number;
  shortCode: string;
  longUrl: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [urls, setUrls] = useState<Url[]>([]);
  const [longUrl, setLongUrl] = useState<string>("");
  const [customAlias, setCustomAlias] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetchUrls();
    }
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await api.get("/api/urls/my?page=0&size=10");
      setUrls(res.data.content);
    } catch (err) {
      console.log("Error fetching URLs");
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/api/urls", {
        longUrl,
        customAlias,
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
            key={url.id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Short:</strong>{" "}
                http://localhost:8080/r/{url.shortCode}
              </p>
              <p>
                <strong>Long:</strong> {url.longUrl}
              </p>
            </div>

            <button
              onClick={() => handleDelete(url.shortCode)}
              className="bg-red-500 text-white px-3 py-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}