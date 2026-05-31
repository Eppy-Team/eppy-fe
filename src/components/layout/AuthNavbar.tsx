"use client";

import { useRouter } from "next/navigation";

export default function AuthNavbar() {
    const router = useRouter();
    return (
        <nav
            className="w-full bg-white border-b px-8 py-3 flex items-center justify-between sticky top-0 z-50"
            style={{ borderColor: "#D4E6F7" }}
        >
            <button onClick={() => router.push("/login")} className="flex items-center gap-2">
                <img src="/images/eppy-logo.png" alt="Eppy" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl" style={{ color: "#003087" }}>Eppy</span>
            </button>
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#003087" }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </div>
        </nav>
    );
}