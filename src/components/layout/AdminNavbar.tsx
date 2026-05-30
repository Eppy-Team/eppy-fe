"use client";

import { useRouter } from "next/navigation";

export default function AdminNavbar() {
    const router = useRouter();

    return (
        <nav className="h-[72px] bg-white border-b border-[#D4E6F7] flex items-center justify-between px-8">
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => router.push("/dashboard")}
            >
                <img
                    src="/images/eppy-logo.png"
                    alt="Eppy"
                    className="w-10 h-10"
                />

                <span className="text-[#003087] text-2xl font-bold">
                    Eppy
                </span>
            </div>

            <button
                onClick={() => router.push("/login")}
                className="w-11 h-11 rounded-full bg-[#003087] flex items-center justify-center"
            >
                {/* icon user */}
            </button>
        </nav>
    );
}