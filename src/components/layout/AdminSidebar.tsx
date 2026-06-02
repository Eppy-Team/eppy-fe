"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
    active: string;
}

const menus = [
    {
        title: "Dashboard Chatbot",
        path: "/dashboard",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        title: "Dashboard Tiket",
        path: "/admin-tickets",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12v10H4V12" />
                <path d="M22 7H2v5h20V7z" />
            </svg>
        ),
    },
    {
        title: "Knowledge Based",
        path: "/knowledge-base",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        ),
    },
];

export default function AdminSidebar({ active }: Props) {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const name = localStorage.getItem("eppy_name");
        const email = localStorage.getItem("eppy_email");
        if (name) setUserName(name);
        if (email) setUserEmail(email);
    }, []);

    return (
        <aside
            className="w-60 bg-white flex flex-col h-full shrink-0"
            style={{ borderRight: "1px solid #D4E6F7" }}
        >
            {/* Logo */}
            <div className="px-5 py-5 flex items-center gap-2">
                <img src="/images/eppy-logo.png" alt="Eppy" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl" style={{ color: "#003087" }}>Eppy</span>
            </div>

            {/* Menu */}
            <div className="px-3 flex flex-col gap-1 flex-1">
                {menus.map((menu) => (
                    <button
                        key={menu.path}
                        onClick={() => router.push(menu.path)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full text-left"
                        style={{
                            backgroundColor: active === menu.path ? "#DDEAF6" : "transparent",
                            color: active === menu.path ? "#003087" : "#374151",
                        }}
                    >
                        {menu.icon}
                        {menu.title}
                    </button>
                ))}
            </div>

            {/* User di bawah */}
            <div className="px-4 py-4 border-t relative" style={{ borderColor: "#D4E6F7" }}>
                <button
                    onClick={() => setShowProfile((v) => !v)}
                    className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
                >
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ backgroundColor: "#003087" }}
                    >
                        {userName ? userName[0].toUpperCase() : "A"}
                    </div>
                    <span className="text-sm font-semibold truncate" style={{ color: "#003087" }}>
                        {userName || "Admin"}
                    </span>
                </button>
                <button
                    onClick={() => router.push("/chat")}
                    className="mt-3 w-full px-3 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#003087" }}
                >
                    Buka User
                </button>

                {/* Popup profil */}
                {showProfile && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                        <div
                            className="absolute bottom-16 left-2 right-2 z-20 p-4 flex flex-col items-center gap-3"
                            style={{
                                backgroundColor: "#DDEAF6",
                                borderRadius: "12px",
                                border: "1px solid #003087",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div className="flex flex-col items-center gap-0.5">
                                <p className="text-sm font-bold" style={{ color: "#003087" }}>{userName || "Admin"}</p>
                                <p className="text-xs text-gray-500">{userEmail || ""}</p>
                            </div>
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => { setShowProfile(false); router.push("/forgot-password"); }}
                                    className="flex-1 px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap flex justify-center items-center text-center leading-tight"
                                    style={{ backgroundColor: "#0070C0", borderRadius: "8px", border: "none" }}
                                >
                                    Ubah Kata Sandi
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("eppy_token");
                                        localStorage.removeItem("eppy_role");
                                        localStorage.removeItem("eppy_name");
                                        localStorage.removeItem("eppy_email");
                                        setShowProfile(false);
                                        router.push("/login");
                                    }}
                                    className="flex-1 px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity flex justify-center items-center text-center leading-tight"
                                    style={{ backgroundColor: "#0070C0", borderRadius: "8px", border: "none" }}
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}