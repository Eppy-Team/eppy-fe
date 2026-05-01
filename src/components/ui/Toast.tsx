"use client";

import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: { backgroundColor: "#F0FDF4", borderColor: "#86EFAC", color: "#16a34a" },
        error: { backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#dc2626" },
        info: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE", color: "#2563eb" },
    };

    const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
    };

    return (
        <div
            className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-md text-sm font-medium animate-fade-in"
            style={{
                border: `1px solid ${styles[type].borderColor}`,
                backgroundColor: styles[type].backgroundColor,
                color: styles[type].color,
                minWidth: "280px",
                maxWidth: "400px",
            }}
        >
            <span>{icons[type]}</span>
            <span className="flex-1">{message}</span>
            <button
                onClick={onClose}
                className="hover:opacity-70 transition-opacity ml-2 font-bold"
            >
                ×
            </button>
        </div>
    );
}