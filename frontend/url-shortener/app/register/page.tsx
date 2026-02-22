"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Axios, AxiosError } from "axios";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleRegister = async () => {
        try {
            const trimmedUsername = username.trim();
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();

            
            await api.post("/api/auth/register", {
                username: trimmedUsername,
                email: trimmedEmail,
                password: trimmedPassword,
            });

            router.push("/login");
        } catch (error: any) {
            const err = error as AxiosError<any>;

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong");
            }

        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-3xl font-bold">Register</h1>

            {error && (
                <div className="bg-red-100 text-red-600 p-2 rounded">
                    {error}
                </div>
            )}

            <input
                className="border p-2 w-80"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                className="border p-2 w-80"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border p-2 w-80"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleRegister}
                className="bg-black text-white p-2 w-80"
            >
                Register
            </button>

            <p>
                Already have an account?{" "}
                <span
                    onClick={() => router.push("/login")}
                    className="text-blue-500 cursor-pointer"
                >
                    Login
                </span>
            </p>
        </div>
    );
}