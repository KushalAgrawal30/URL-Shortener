"use client";

import { useEffect, useState, useCallback } from "react";

export interface ToastMessage {
    id: number;
    text: string;
    type: "success" | "error";
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, text, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, showToast, removeToast };
}

export function ToastContainer({
    toasts,
    removeToast,
}: {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
}

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: ToastMessage;
    onDismiss: (id: number) => void;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const enterTimer = requestAnimationFrame(() => setVisible(true));

        // Auto-dismiss after 3s
        const dismissTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onDismiss(toast.id), 300);
        }, 3000);

        return () => {
            cancelAnimationFrame(enterTimer);
            clearTimeout(dismissTimer);
        };
    }, [toast.id, onDismiss]);

    const isSuccess = toast.type === "success";

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 min-w-[280px] max-w-sm px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 ease-out ${
                visible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-8 opacity-0"
            } ${
                isSuccess
                    ? "bg-white border-emerald-200 text-emerald-800"
                    : "bg-white border-red-200 text-red-800"
            }`}
        >
            {/* Icon */}
            <div className={`shrink-0 ${isSuccess ? "text-emerald-500" : "text-red-500"}`}>
                {isSuccess ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>

            {/* Text */}
            <p className="text-sm font-medium flex-1">{toast.text}</p>

            {/* Close */}
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(() => onDismiss(toast.id), 300);
                }}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
